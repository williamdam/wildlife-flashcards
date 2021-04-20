import React from "react";
import ReactDOM from "react-dom";
import "./css/styles.css";
import "./css/bootstrap.css";

// Web location of csv file, containing wildlife data
const webURL = "http://take-home-wildlife.s3-website-us-west-2.amazonaws.com/data.csv";

// Var holds JSON object, parsed form csv file
let animalObject = {};

const pageTitle = <h1>Wildlife Flashcard App</h1>;

//////////////////////////////////////////////////////////////////////
// Description: Get csv file from url
// Args: webURL string
// Returns: None.  Saves JSON to animalObject var.
//////////////////////////////////////////////////////////////////////
fetch(webURL)
    .then(response => response.text())
    .then(text => _convertToJson(text))
    .then(function(object) {
        animalObject = object;
        console.log(animalObject);
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

class Flashcards extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isToggleOn: true,
            slideNum: 0
        };

        // This binding is necessary to make `this` work in the callback
        this.flipCard = this.flipCard.bind(this);
        this.nextSlide = this.nextSlide.bind(this);
        this.prevSlide = this.prevSlide.bind(this);
    }

    flipCard() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
      }

    nextSlide() {
        if (this.state.slideNum === animalObject.length - 1) {
            this.setState(state => ({
                slideNum: 0
            }));
        } else {
            this.setState(state => ({
                slideNum: state.slideNum + 1
            }));
        }
    }

    prevSlide() {
        if (this.state.slideNum === 0) {
            this.setState(state => ({
                slideNum: animalObject.length - 1
            }));
        } else {
            this.setState(state => ({
                slideNum: state.slideNum - 1
            }));
        }
    }

    render() {
        let index = this.state.slideNum;
        if (this.state.isToggleOn) {
            return (
                <div className="container">
                    <h1 className="text-center">{pageTitle}</h1>
                    <div className="mx-auto m-4 col-md-6">
                        <div>
                            <div onClick={this.flipCard} className="slide">{cardFront(index)}</div>
                            {cardCredit(index)}
                        </div>
                        <div className="row">
                            <button className="btn btn-primary col-5 mx-auto" onClick={this.prevSlide}>
                                Prev Slide
                            </button>
                            <button className="btn btn-primary col-5 mx-auto" onClick={this.nextSlide}>
                                Next Slide
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container">
                    <h1 className="text-center">{pageTitle}</h1>
                    <div className="mx-auto m-4 col-md-6">
                        <div>
                            <div onClick={this.flipCard} className="slide">{cardBack(index)}</div>
                            <p className="credit"></p>
                        </div>
                        <div className="row">
                            <button className="btn btn-primary col-5 mx-auto" onClick={this.prevSlide}>
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
