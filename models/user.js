var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Post = require('./post.js');

var UserSchema = new Schema({
  username: String,
  password: String,
  image: String,
  description: String,
  posts: [Post.schema]
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', UserSchema);
module.exports = User;
