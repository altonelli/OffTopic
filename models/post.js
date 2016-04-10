var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var Comment = require("./comment.js");

var PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  date: Date,
  text: String,
  image: String,
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [Comment.schema]
});

PostSchema.plugin(deepPopulate);

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;
