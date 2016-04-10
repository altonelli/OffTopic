var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);


var CommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  text: String,
  date: Date,
  image: String,
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

CommentSchema.plugin(deepPopulate);

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
