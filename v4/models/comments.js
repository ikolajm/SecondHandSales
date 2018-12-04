var mongoose = require("mongoose");

// Schema
var commentSchema = mongoose.Schema({
    text: String,
    author: String
});

// Export model
module.exports = mongoose.model("Comment", commentSchema);  