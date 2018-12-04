var Thrift = require("../models/thrifts.js");
var Comment = require("../models/comments.js");

// Create middleware object to export to all routes
var middlewareObj = {};

// =====MIDDLEWARE=====

    // Push all middleware functions into middlewareObj
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // If person is not logged in, show flash message
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    }
};

middlewareObj.checkPostOwnership = function(req, res, next) {
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
                // Flash message
                req.flash("error", "You do not have permission to modify this posting.");
                // User doesn't have permission to edit, redirect
                res.redirect("back");
               }
           }
        });
    } else {
        // Show flash message
        req.flash("error", "You need to be logged in to do that.");
        // Go back if not signed in
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // Check if user is logged in
    if (req.isAuthenticated()) {
        // get comment id
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            console.log("params.id returns: " + req.params.id);
            console.log("params.comment_id returns: " + req.params.comment_id);
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                // Check if user id equals comment author id
                if (foundComment.author.id.equals(req.user._id)) {
                    // If so, access granted
                    next();
                } else {
                    // Flash message
                    req.flash("error", "You do not have permission to modify this comment.");
                    res.redirect("back");   
                }
            }
        });
    } else {
        // Show flash message
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};


// Export all middleware through middleware obj
module.exports = middlewareObj;