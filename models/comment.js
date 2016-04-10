var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var CommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  text: String,
  date: Date,
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
