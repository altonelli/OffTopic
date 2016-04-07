var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Comment = require("./comment.js");

var PostSchema = new Schema({
  author: String,
  date: String,
  text: String,
  likes: Number,
  comments: [Comment.schema]
});

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;
