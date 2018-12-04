// Require all installs
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

// App will look for .ejs files by default when rendering
app.set("view engine", "ejs");

// Set public directory for style and script files
app.use(express.static(__dirname + "/public"));

// Let app use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// Fill with data
var thrifts = [
        {
            name: "Ted's Thrifts",
            image: "https://media.timeout.com/images/100517369/image.jpg",
        },
        {
            name: "Shelly's sales",
            image: "https://static1.squarespace.com/static/5a9415d875f9ee1e520f2403/t/5b1e8d161ae6cf6815bf1d09/1528728864842/Thrifts-and-Gifts.jpg",
        },
        {
            name: "Ted's Thrifts",
            image: "https://media.timeout.com/images/100517369/image.jpg",
        },{
            name: "Ted's Thrifts",
            image: "https://media.timeout.com/images/100517369/image.jpg",
        },{
            name: "Ted's Thrifts",
            image: "https://media.timeout.com/images/100517369/image.jpg",
        },{
            name: "Ted's Thrifts",
            image: "https://media.timeout.com/images/100517369/image.jpg",
        }
        ];

// Index route - Direct to landing page
app.get("/", function(req, res) {
    // Render landing.ejs page
   res.render("landing"); 
});

// Show - show all thrifts on a main page
app.get("/thrifts", function(req, res) {
    // Render the thrifts.ejs page, include thrifts array as thrifts
   res.render("thrifts", {thrifts: thrifts}); 
});

// Direct to form to add new thrift store
app.get("/thrifts/new", function(req, res) {
    // Render the new.ejs page with form so user can add new thrift
   res.render("new"); 
});

// Post - Have the ability to add a new thrift - add to thrifts main page
app.post("/thrifts", function(req, res) {
    // Get data from form
    var name = req.body.name;
    var image = req.body.image;
    // Create object with data
    var newThrift = {
        name: name,
        image: image
    };
    // Add to thrifts array
    thrifts.push(newThrift);
    // Redirect back to thrifts main page - default will redirect to .get
    res.redirect("/thrifts");
});

// Listen for servers to start on cloud9
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("The app has started successfully..."); 
});