import React from "react";
import ReactDOM from "react-dom";
import "./css/styles.css";
import "./css/bootstrap.css";

// Web location of csv file, containing wildlife data
const webURL = "http://take-home-wildlife.s3-website-us-west-2.amazonaws.com/data.csv";

// Var holds JSON object, parsed form csv file
let animalObject = {};

// Display title of page
const pageTitle = <h1>Wildlife Flashcard App</h1>;

//////////////////////////////////////////////////////////////////////
// Description: Get csv file from url
// Args: webURL string
// Returns: None.  Saves JSON to animalObject var, then calls render()
//////////////////////////////////////////////////////////////////////
fetch(webURL)                               // Fetch data from url
    .then(response => response.text())      // Get text content from response
    .then(text => _convertToJson(text))     // Call helper function to convert to JSON
    .then(function(object) {                // Pass JSON object to closure
        animalObject = object;              // Assign JSON object to local var
        //console.log(animalObject);          // Print JSON for debug

        // Render to DOM, pass in Flashcards class
        ReactDOM.render(<Flashcards />, document.getElementById("root"));
    });

//////////////////////////////////////////////////////////////////////
// Description: Converts csv file to JSON object.
// Args: csv text file with comma separators
// Returns: JSON object
// Source: http://techslides.com/convert-csv-to-json-in-javascript
//////////////////////////////////////////////////////////////////////
function _convertToJson(csv) {

    var result = [];                                // Array holds JSON objects
    var rows = csv.split('\n');                     // Divide file by lines
    var headers = rows[0].split(',');               // Split header by commas

    // Make JSON objects from csv rows
    for (let i = 1; i < rows.length - 1; i++) {         // For each row

        var object = {};                                // Holds JSON object 

        // Split row by commas, outside of quotes, using regular expression
        // Source: https://regexr.com/44u6o
        var currentRow = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        // Save key-value pairs to JSON object
        for(let j = 0; j < headers.length; j++) {   // Header elements contain keys
            object[headers[j]] = currentRow[j];     // Current row contains
        }

        result.push(object);                        // Add JSON object to result array
    }

    var jsonString = JSON.stringify(result);        // Convert result array to JSON string
    return JSON.parse(jsonString);                  // Parse JSON string and return
}

//////////////////////////////////////////////////////////////////////
// Description: Displays image for front of flashcard
// Args: Index for JSON object
// Returns: <img>
//////////////////////////////////////////////////////////////////////
function cardFront(i) {
    return (
        <img className="cardFront" src={animalObject[i].image} />
    );
}

//////////////////////////////////////////////////////////////////////
// Description: Displays photo credit line for front of flashcard
// Args: Index for JSON object
// Returns: <p>
//////////////////////////////////////////////////////////////////////
function cardCredit(i) {
    return (
        <p className="credit">{animalObject[i].credit}</p>
    );
}

//////////////////////////////////////////////////////////////////////
// Description: Displays back of flashcard
// Args: Index for JSON object
// Returns: <div>
//////////////////////////////////////////////////////////////////////
function cardBack(i) {
    return (
        <div className="cardBack">
            <p>Class: {animalObject[i].class}</p>
            <p>Order: {animalObject[i].order}</p>
            <p>Family: {animalObject[i].family}</p>
            <p>Genus: {animalObject[i].genus}</p>
            <p>Species: {animalObject[i].species}</p>
            <p>Common Name: {animalObject[i].name}</p>
        </div>
        
    );
}

//////////////////////////////////////////////////////////////////////
// Description: React class to display flashcards
// Args: None.  Invoked from fetch, promise chain.
// Returns: Front and back of postcards
// Source: https://reactjs.org/docs/handling-events.html
//////////////////////////////////////////////////////////////////////
class Flashcards extends React.Component {
    
    // Initialize states. 
    // bool isCardFront holds state to toggle flashcards
    // int slideNum holds state for flashcard index
    constructor(props) {
        super(props);
        this.state = {
            isCardFront: true,
            slideNum: 0
        };

        // This binding is necessary to make `this` work in the callback
        this.flipCard = this.flipCard.bind(this);
        this.nextSlide = this.nextSlide.bind(this);
        this.prevSlide = this.prevSlide.bind(this);
    }

    // Toggle state for front and back of card
    flipCard() {
        this.setState(state => ({
            isCardFront: !state.isCardFront
        }));
      }

    // Update state to increment card index
    nextSlide() {
        if (this.state.slideNum === animalObject.length - 1) {  // Edge case: index > last element
            this.setState(state => ({
                slideNum: 0
            }));
        } else {
            this.setState(state => ({
                slideNum: state.slideNum + 1
            }));
        }
    }

    // Update state to decrement card index
    prevSlide() {
        if (this.state.slideNum === 0) {            // Edge case: index < first element
            this.setState(state => ({
                slideNum: animalObject.length - 1
            }));
        } else {
            this.setState(state => ({
                slideNum: state.slideNum - 1
            }));
        }
    }

    // Return div for display
    render() {
        let index = this.state.slideNum;    // Save current state to var index

        // Show front of flashcard 
        if (this.state.isCardFront) {
            return (
                <div className="container">
                    <h1 className="text-center">{pageTitle}</h1>
                    <p className="text-center">Click on the image to reveal details</p>
                    <div className="mx-auto m-4 col-md-6">
                        <div>
                            <div onClick={this.flipCard} className="slide">{cardFront(index)}</div>
                            {cardCredit(index)}
                        </div>
                        <div className="row">
                            <button className="btn btn-secondary col-5 mx-auto" onClick={this.prevSlide}>
                                Prev Slide
                            </button>
                            <button className="btn btn-primary col-5 mx-auto" onClick={this.nextSlide}>
                                Next Slide
                            </button>
                        </div>
                    </div>
                </div>
            );
        } 
        
        // Show back of flashcard
        else {
            return (
                <div className="container">
                    <h1 className="text-center">{pageTitle}</h1>
                    <p className="text-center">Click on the slide to see picture</p>
                    <div className="mx-auto m-4 col-md-6">
                        <div>
                            <div onClick={this.flipCard} className="slide">{cardBack(index)}</div>
                            <p className="credit"></p>
                        </div>
                        <div className="row">
                            <button className="btn btn-secondary col-5 mx-auto" onClick={this.prevSlide}>
                                Prev Slide
                            </button>
                            <button className="btn btn-primary col-5 mx-auto" onClick={this.nextSlide}>
                                Next Slide
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

    }
}


module.hot.accept();
