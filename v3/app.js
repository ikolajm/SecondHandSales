// Require all installs
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
// Require models
var Thrift = require("./models/thrifts.js");
var Comment = require("./models/comments.js");
var User = require("./models/users.js");
// Require seedDB
var seedDB = require("./seeds.js");

// Run seedDB() on app reset
seedDB();

// App will look for .ejs files by default when rendering
app.set("view engine", "ejs");

// Set public directory for style and script files
app.use(express.static(__dirname + "/public"));

// Let app use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// Configure mongoose - first time creates this db, after this will always connect to db
mongoose.connect('mongodb://localhost:27017/thriftapp', { useNewUrlParser: true });

// Index route - Direct to landing page
app.get("/", function(req, res) {
    // Render landing.ejs page
   res.render("landing"); 
});

// Show - show all thrifts on a main page
app.get("/thrifts", function(req, res) {
    // Get all thrifts from db using thrift model
    Thrift.find({}, function(err, allThrifts) {
        if (err) {
            console.log(err);
        } else {
            // Render the thrifts.ejs page, include thrifts from db as "allThrifts"
            res.render("thrifts", {thrifts: allThrifts}); 
        }
    });
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
    var desc = req.body.desc;
    // Create object with data
    var newThrift = {
        name: name,
        image: image,
        desc: desc
    };
    // Create new thrft and send to db
    Thrift.create(newThrift, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // Redirect to thrifts page to show new addition
            res.redirect("/thrifts");
        }
    });
});

// Show - show individual page for single thrift opportunity
app.get("/thrifts/:id", function(req, res) {
    // Find thrift with given id
    Thrift.findById(req.params.id).populate("comments").exec(function(err, foundThrift) {
        if (err) {
            console.log(err);
        } else {
            // Redirect to the individual page of the thrift (show.ejs) passing its individual data as "foundThrift"
            res.render("show", {thrift: foundThrift}); 
        }
    });
});

// Listen for servers to start on cloud9
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("The app has started successfully..."); 
});