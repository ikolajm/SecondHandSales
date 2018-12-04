var express = require("express");
var router = express.Router();

// Require the models needed (Comment, Thrift)
var Thrift = require("../models/thrifts.js");
var Comment = require("../models/comments.js");

// Require middleware
var middleware = require("../middleware/middleware.js");

// =====COMMENTS=====

// New - Create a new comment with the comment form
router.get("/thrifts/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    // Find seller by id, pass variable into the form
    Thrift.findById(req.params.id, function(err, foundThrift) {
       if (err) {
           console.log(err);
           // Flash message
           req.flash("error", err.message);
            //  Redirect to single page
            res.redirect("/thrifts/" + req.params.id);
       } else {
            // Send to form to add comment
            res.render("comment/new", {thrift: foundThrift});
       }
    });
});

// Create - post the comment from the GET route, save to thirft
router.post("/thrifts/:id/comments", middleware.isLoggedIn, function(req, res) {
    // Lookup seller by id
    Thrift.findById(req.params.id, function(err, foundThrift) {
       if (err) {
           console.log(err);
           // Flash message
           req.flash("error", err.message);
            // Send back to main page
            res.redirect("/thrifts");
       } else {
            // Create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                    // Flash message
                    req.flash("error", err.message);
                    // Redirect to singular page
                    res.redirect("/thrifts/" + req.params.id);
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
                            // Flash message
                            req.flash("error", err.message);
                            // Redirect to singular page
                            res.redirect("/thrifts/" + foundThrift._id);
                        } else {
                            // Flash message
                            req.flash("success", "Successfully added your comment!");
                            // Direct to the singular thrift with a new comment
                            res.redirect("/thrifts/" + foundThrift._id);
                        }
                    });
                }
            });
       }
    });
});

// Edit - edit an existing comment
router.get("/thrifts/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            console.log(err);
            // Flash message
            req.flash("error", err.message);
            res.redirect("back");
        } else {
                                    // Get thrift id and pass into edit form
            res.render("comment/edit", {thrift_id: req.params.id, comment: foundComment});
        }
    })
    
    
});

// Update - update comment with information from edit form
router.put("/thrifts/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, update) {
       if (err) {
           console.log(err);
            // Flash message
            req.flash("error", err.message);
           res.redirect("back");
       } else {
            // Flash message
            req.flash("success", "Successfully modified your comment!");
           res.redirect("/thrifts/" + req.params.id);
       }
    });
});

// Delete
router.delete("/thrifts/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndDelete(req.params.comment_id, function(err) {
       if (err) {
           console.log(err);
            // Flash message
           req.flash("error", err.message);
           res.redirect("/thrifts/" + req.params.id);
       } else {
            // Flash message
            req.flash("success", "Successfully deleted your comment!");
           res.redirect("/thrifts/" + req.params.id);
       }
   }); 
});

// Export routes to app.js
module.exports = router;