var mongoose = require("mongoose");
var Thrift = require("./models/thrifts.js");
var Comment = require("./models/comments.js");

// Filler data
var data = [
        {
            name: "Charlie's Deals",
            image: "https://www.urbanpeak.org/wp-content/uploads/2018/07/Peak-Thrift-Denver-WEB-0001.jpg",
            desc: "On east side of town, very friendly"
        }, 
        {
            name: "Sean's Sales",
            image: "http://www.jericho-road.net/wp-content/uploads/2014/01/100_0290.jpg",
            desc: "On west side of town, very friendly"
        },
        {
            name: "Tammy's Trinkets",
            image: "https://static1.squarespace.com/static/55fc7b94e4b09a69209d2f4a/t/59834dc537c58150b472d6db/1501777360468/a.jpg?format=1000w",
            desc: "On north side of town, very friendly"
        }
    ];

function seedDB() {
    // Remove everything from thrifts db
    Thrift.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed all thrifts successfully!");
            // Add a couple thrifts
            data.forEach(function(seed) {
                Thrift.create(seed, function(err, thrift) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(thrift.name + " added successfully!");
                        // Add a comment
                        Comment.create(
                            {
                                text: "This place is cool, but their underwear gave me crabs...",
                                author: "Sally"
                            }, function(err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    // Push comment to comments of thrift
                                    thrift.comments.push(comment);
                                    thrift.save(function(err) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log("Comment added successfully!");
                                        }
                                    });
                                }
                            }
                        );
                    }
                });
            });
        }    
    });
}

// Export function to app.js
module.exports = seedDB;


