var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Comment = require("./comment.js");

var PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  date: String,
  text: String,
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [Comment.schema]
});

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;
