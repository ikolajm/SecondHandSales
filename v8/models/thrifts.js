var mongoose = require("mongoose");

// Thrift Schema
var thriftSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    address: String,
    city: String,
    // Option
    state: String,
    // ******
    zip: String,
    open: String,
    close: String,
    // Option
    price: String,
    // ******
    // Checkboxes
    clothes: String,
    furniture: String,
    art: String,
    antiques: String,
    electronics: String,
    // ********
    createdAt: {
                    type: Date,
                    default: Date.now 
                },
    author: {
                id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                    },
                username: String
            },
    comments: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Comment"
                }
            ]
});

// Thrift Model (allows methods such as "Thrift.find()" )
module.exports = mongoose.model("Thrift", thriftSchema);

// TEST DB
// Thrift.create(
//     {
//         name: "Timmy's sales",
//         image: "https://static1.squarespace.com/static/5a9415d875f9ee1e520f2403/t/5b1e8d161ae6cf6815bf1d09/1528728864842/Thrifts-and-Gifts.jpg"
//     }, function(err, thrift) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("New thrift: ");
//         console.log(thrift);
//     }
// });