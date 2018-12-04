// Require all installs
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
// Require models
var User = require("./models/users.js");
// Require seedDB
var seedDB = require("./seeds.js");
// Require routes
var thriftRoutes = require("./routes/thrifts.js");
var commentRoutes = require("./routes/comments.js");
var authRoutes = require("./routes/auth.js");


// Run seedDB() on app reset
// seedDB();

// Init moment.js
app.locals.moment = require('moment');

// Let app use flash
app.use(flash());

// Passport configuration
app.use(require("express-session")({
    secret: "this is a secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// App will look for .ejs files by default when rendering
app.set("view engine", "ejs");

// Set public directory for style and script files
app.use(express.static(__dirname + "/public"));

// Let app use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// Make app use method override
app.use(methodOverride("_method"));

// Configure mongoose - first time creates this db, after this will always connect to db
mongoose.connect('mongodb://localhost:27017/thriftapp', { useNewUrlParser: true });

// Check for current user on all pages and pass it over, do the same for flash messages 
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.messageError = req.flash("error");
    res.locals.messageSuccess = req.flash("success");
    next();
});

// Make app.js use the routes required above
app.use(thriftRoutes);
app.use(commentRoutes);
app.use(authRoutes);

// Listen for servers to start on cloud9
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("The app has started successfully..."); 
});