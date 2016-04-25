var db = require('../models');

function index(req, res) {
  db.User.findOne({_id: req.params.user})
  .populate('posts posts.author posts.likes posts.comments posts.comments.author')
  .deepPopulate('friends friends.posts friends.posts.author friends.posts.likes friends.posts.comments friends.posts.comments.likes friends.posts.comments.author')
  .exec(function(err,user){
    if (err) {res.status(500).json("Sorry, error occurred while looking for your profile");}
    else if(!user) {res.status(400).json("Sorry, we could nto find your profile. You must not exist."); }
    else {
      user.posts.sort(function(a,b){
        if (a.date > b.date){
          return 1;
        } else if (a.date < b.date) {
          return -1;
        }
        return 0;
      });
      res.status(200).json(user.posts);
      }
  });
}

function create(req, res) {

}

function show(req, res) {

}

function destroy(req, res) {

}

function update(req, res) {

}



// export public methods here
// consider not exporting functionality that doesn't exist - it could confuse future you or other devs
module.exports = {
  index: index//,
  // create: create,
  // show: show,
  // destroy: destroy,
  // update: update
};
