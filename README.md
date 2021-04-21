# Wildlife Flash Card App

### Description:

Flash card app to display samples of wildlife species.

### Project details

* Application loads data from this file: (http://take-home-wildlife.s3-website-us-west-2.amazonaws.com/data.csv)
* The app should display each of the animals listed in the file as a flash card. The initial view of the flash card will contain the image and attribution (credit) but no other details.
* When an image is clicked, the following information will appear, identifying the species:
    * Class
    * Order
    * Family
    * Genus
    * Species
    * Common Name
* The app display should work across various device widths (phones, tablets, PCs).

### Installation Instructions

* Run application on local machine:
    * Clone this repository
    * Navigate to directory
        * Run application locally using: 'npm install' and 'npm start'
* Run applicaiton on web server:
    * Build the application by running: 'npm run build'
    * Update bundle.js filepath in project_name/public/index.html
    * Upload index.html file, and bundle folder to public_html

### Resources:

- Bootstrap 5: https://getbootstrap.com/docs/5.0/getting-started/download/
- React: https://reactjs.org/docs/getting-started.html
- Webpack: https://webpack.js.org/
