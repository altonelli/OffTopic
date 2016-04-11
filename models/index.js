var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/offtopic");
mongoose.connect( process.env.MONGOLAB_URI ||
                  process.env.MONGOHQ_URL ||
                  "https://fast-cliffs-93554.herokuapp.com/" );

// https://fast-cliffs-93554.herokuapp.com/ | https://git.heroku.com/fast-cliffs-93554.git

module.exports.Post = require("./post.js");
module.exports.Comment = require("./comment.js");
module.exports.User = require("./user.js");
