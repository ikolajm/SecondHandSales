var express = require("express");
var router = express.Router();

// Require the models needed (Comment, Thrift)
var Thrift = require("../models/thrifts.js");

// =====MIDDLEWARE=====

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

function checkPostOwnership(req, res, next) {
    // Check to see if user is logged in
    if (req.isAuthenticated()) {
        // Find thrift by id and then return information
        Thrift.findById(req.params.id, function(err, foundThrift) {
           if (err) {
               console.log(err);
               res.redirect("back");
           } else {
               // Check to see if author id matches user id
               if (foundThrift.author.id.equals(req.user._id)) {
                //   if so, send to edit page
                   next();
               } else {
                // User doesn't have permission to edit, redirect
                res.redirect("back");
               }
           }
        });
    } else {
        // Go back if not signed in
        res.redirect("back");
    }
}

// =====THRIFTS=====

// Root route - Direct to landing page
router.get("/", function(req, res) {
    // Render landing.ejs page
   res.render("landing"); 
});

// Show - show all thrifts on a main page
router.get("/thrifts", function(req, res) {
    // Get all thrifts from db using thrift model
    Thrift.find({}, function(err, allThrifts) {
        if (err) {
            console.log(err);
        } else {
            // Render the thrifts.ejs page, include thrifts from db as "allThrifts"
            res.render("thrifts/thrifts", {thrifts: allThrifts}); 
        }
    });
});

// Direct to form to add new thrift store
router.get("/thrifts/new", isLoggedIn, function(req, res) {
    // Render the new.ejs page with form so user can add new thrift
   res.render("thrifts/new"); 
});

// Post - Have the ability to add a new thrift - add to thrifts main page
router.post("/thrifts", isLoggedIn, function(req, res) {
    // Collect username/user id
    var author = {
                    id: req.user._id,
                    username: req.user.username
                };
    // Get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    // Create object with data
    var newThrift = {
        name: name,
        image: image,
        desc: desc,
        author: author
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
router.get("/thrifts/:id", function(req, res) {
    // Find thrift with given id
    Thrift.findById(req.params.id).populate("comments").exec(function(err, foundThrift) {
        if (err) {
            console.log(err);
        } else {
            // Redirect to the individual page of the thrift (show.ejs) passing its individual data as "foundThrift"
            res.render("thrifts/show", {thrift: foundThrift}); 
        }
    });
});

// Edit - edit a seller posting if it is the users
router.get("/thrifts/:id/edit", checkPostOwnership, function(req, res) {
    Thrift.findById(req.params.id, function(err, foundThrift) {
        if (err) {
            console.log(err);
        } else {
            res.render("thrifts/edit", {thrift: foundThrift});
        }
    });
});

// Update - take the information being modified and put it in seller entry
router.put("/thrifts/:id", checkPostOwnership, function(req, res) {
    // Find thrift by id and add changes made (what id, what will it be updated with, callback function)
    Thrift.findByIdAndUpdate(req.params.id, req.body.thrift, function(err, update) {
        if (err) {
            console.log(err);
            res.redirect("/thrifts");
        } else {
            // Redirect to indivdual thrift *****
            res.redirect("/thrifts/" + req.params.id);
        }
    });
});

// Delete - delete the posting if it is the users posting
router.delete("/thrifts/:id", checkPostOwnership, function(req, res) {
    // Find by id and delete
    Thrift.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/thrifts/" + req.params.id);
        } else {
            res.redirect("/thrifts");
        }
    });
});


// Export routes to app.js
module.exports = router;
