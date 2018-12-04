var express = require("express");
var router = express.Router();

// Require the models needed (Comment, Thrift)
var Thrift = require("../models/thrifts.js");

// Require middleware
var middleware = require("../middleware/middleware.js");

// =====THRIFTS=====

// Root route - Direct to landing page
router.get("/", function(req, res) {
    // Render landing.ejs page
   res.render("landing"); 
});

// Show - show all thrifts on a main page
router.get("/thrifts", function (req, res) {
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    // Check if search is being made
    if (req.query.search) {
        // Make sure search is safe
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // SEARCH BY DIFFERENT TERMS SUCH AS NAME, STATE, CITY, ZIP
        Thrift.find({$or: [ {name: regex}, {state: regex}, {city:regex}, {zip: regex} ]}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allThrifts) {
            Thrift.count({$or: [ {name: regex}, {state: regex}, {city:regex}, {zip: regex} ]}).exec(function (err, count) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if(allThrifts.length < 1) {
                        noMatch = "No items match that search, please try again.";
                    }
                    res.render("thrifts/thrifts", {
                        thrifts: allThrifts,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: req.query.search
                    });
                }
            });
        });
    } else {
        var perPage = 8;
        var pageQuery = parseInt(req.query.page);
        var pageNumber = pageQuery ? pageQuery : 1;
        Thrift.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allThrifts) {
            if (err){
                console.log(err);
            } else {
                Thrift.count().exec(function (err, count) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render("thrifts/thrifts", {
                            thrifts: allThrifts,
                            current: pageNumber,
                            pages: Math.ceil(count / perPage),
                            noMatch: noMatch
                        });
                    }
                });
            }
        });
    }
});

// Direct to form to add new thrift store
router.get("/thrifts/new", middleware.isLoggedIn, function(req, res) {
    // Render the new.ejs page with form so user can add new thrift
   res.render("thrifts/new"); 
});

// Post - Have the ability to add a new thrift - add to thrifts main page
router.post("/thrifts", middleware.isLoggedIn, function(req, res) {
    // Create new thrft and send to db
    Thrift.create(req.body.thrift, function(err, newlyCreated) {
        if (err) {
            console.log(err);
            // Flash message
            req.flash("error", err.message);
            res.redirect("/thrifts");
        } else {
            // Add username and id to owner of the post
            newlyCreated.author.id = req.user._id;
            newlyCreated.author.username = req.user.username;
            // Save the thrift
            newlyCreated.save();
            // Flash message
            req.flash("success", "Posting successfully added!  Thank you!");
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
            // Flash message
            req.flash("error", err.message);
            // Redirect to main page
            res.redirect("/thifts");
        } else {
            // Redirect to the individual page of the thrift (show.ejs) passing its individual data as "foundThrift"
            res.render("thrifts/show", {thrift: foundThrift}); 
        }
    });
});

// Edit - edit a seller posting if it is the users
router.get("/thrifts/:id/edit", middleware.checkPostOwnership, function(req, res) {
    Thrift.findById(req.params.id, function(err, foundThrift) {
        if (err) {
            console.log(err);
            // Flash message
            req.flash("error", err.message);
            // Redirect to main page
            res.redirect("/thrifts");
        } else {
            res.render("thrifts/edit", {thrift: foundThrift});
        }
    });
});

// Update - take the information being modified and put it in seller entry
router.put("/thrifts/:id", middleware.checkPostOwnership, function(req, res) {
    // Find thrift by id and add changes made (what id, what will it be updated with, callback function)
    Thrift.findByIdAndUpdate(req.params.id, req.body.thrift, function(err, update) {
        if (err) {
            console.log(err);
            // Flash message
            req.flash("error", err.message);
            // Redirect to main page
            res.redirect("/thrifts");
        } else {
            // Flash message
            req.flash("success", "Changes successfully made!");
            // Redirect to indivdual thrift
            res.redirect("/thrifts/" + req.params.id);
        }
    });
});

// Delete - delete the posting if it is the users posting
router.delete("/thrifts/:id", middleware.checkPostOwnership, function(req, res) {
    // Find by id and delete
    Thrift.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            // Flash message
            req.flash("error", err.message);
            // Redirect to posting
            res.redirect("/thrifts/" + req.params.id);
        } else {
            // Flash message
            req.flash("success", "Posting successfully deleted!");
            res.redirect("/thrifts");
        }
    });
});

// About page
router.get("/about", function(req, res) {
    res.render("about");
});

// Keep searches safe
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// Export routes to app.js
module.exports = router;