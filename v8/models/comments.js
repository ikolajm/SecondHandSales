var mongoose = require("mongoose");

// Schema
var commentSchema = mongoose.Schema({
    text: String,
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
            }
});

// Export model
module.exports = mongoose.model("Comment", commentSchema);  