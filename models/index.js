var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/offtopic");

module.exports.Post = require("./post.js");
module.exports.Comment = require("./comment.js");
