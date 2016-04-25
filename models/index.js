var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/offtopic");
mongoose.connect( process.env.MONGOLAB_URI ||
                  process.env.MONGOHQ_URL ||
                  "localhost" );
// run `heroku config` make sure the mongo config there uses the same name for the environment variable.
// process.env.MONGOLAB_URI should be changed to match the env variable for your heroku mongodb

module.exports.Post = require("./post.js");
module.exports.Comment = require("./comment.js");
module.exports.User = require("./user.js");
