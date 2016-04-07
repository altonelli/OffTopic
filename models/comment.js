var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  var CommentSchema = new Schema({
    author: String,
    text: String,
    likes: Number
  });

  var Comment = mongoose.model('Comment', CommentSchema);

  module.exports = Comment;
