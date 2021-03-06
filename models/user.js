var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var Post = require('./post.js');
var Comment = require('./comment.js');



var UserSchema = new Schema({
  username: String,
  password: String,
  image: String,
  description: String,
  posts: [Post.schema],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(deepPopulate);


var User = mongoose.model('User', UserSchema);
module.exports = User;
