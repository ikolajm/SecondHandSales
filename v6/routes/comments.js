var express = require("express");
var router = express.Router();

// Require the models needed (Comment, Thrift)
var Thrift = require("../models/thrifts.js");
var Comment = require("../models/comments.js");

// =====MIDDLEWARE=====

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

// =====COMMENTS=====

// New - Create a new comment with the comment form
router.get("/thrifts/:id/comments/new", isLoggedIn, function(req, res) {
    // Find seller by id, pass variable into the form
    Thrift.findById(req.params.id, function(err, foundThrift) {
       if (err) {
           console.log(err);
       } else {
            // Send to form to add comment
            res.render("comment/new", {thrift: foundThrift});
       }
    });
});

// Create - post the comment from the GET route, save to thirft
router.post("/thrifts/:id/comments", isLoggedIn, function(req, res) {
    // Lookup seller by id
    Thrift.findById(req.params.id, function(err, foundThrift) {
       if (err) {
           console.log(err);
            // Send back to main page
            res.redirect("/thrifts");
       } else {
            // Create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // Add username and id to owner of the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save the comment
                    comment.save();
                    // Connect comment to seller
                    foundThrift.comments.push(comment);
                    // Save and redirect to singular page of seller
                    foundThrift.save(function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            // Direct to the singular thrift with a new comment
                            res.redirect("/thrifts/" + foundThrift._id);
                        }
                    });
                }
            });
       }
    });
});

// Export routes to app.js
module.exports = router;