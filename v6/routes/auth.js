var express = require("express");
var router = express.Router();
var passport = require("passport");

// Require User model
var User = require("../models/users.js");

// =====AUTHORIZATION=====

// Show the register form
router.get("/register", function(req, res) {
    // Direct to the register page
   res.render("register"); 
});

// Handle sign up logic
router.post("/register", function(req, res) {
    // Create user variable
    var newUser = new User({username: req.body.username});
    // Create an account (user, password hash, callback)
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            // Short circuit, send back to register form
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/thrifts");
            });
        }
    });
});

// Show login form 
router.get("/login", function(req, res) {
   res.render("login"); 
});

// Handle login logic (With passport.authenticate middleware)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/thrifts",
        failureRedirect: "/login"
        
    }
    ), function(req, res) {
});

// Logout logic
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/thrifts");
});

// Export routes to app.js
module.exports = router;