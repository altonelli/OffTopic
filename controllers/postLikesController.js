var db = require('../models');

function index(req, res) {

}

function create(req, res) {

}

function show(req, res) {

}

function destroy(req, res) {

}

function update(req, res) {
  db.Post.findOne({_id: req.params.post})
  .deepPopulate('comments.author author author.posts author.posts.author author.posts.likes likes comments.likes author')
  .exec(function(err, post){
    db.User.findOne({_id: post.author._id})
    .populate('posts posts.likes')
    .exec(function(err,user){
      user.posts.forEach(function(foundPost){
        if (foundPost._id.toString() === post._id.toString()){
          if(foundPost.likes.length === 0){
            foundPost.likes.push(req.user);
          } else {
            foundPost.likes.forEach(function(like,index){
              if(like._id.toString() === req.user._id.toString()){
                foundPost.likes.splice(index,1);
              } else if (index === foundPost.likes.length-1) {
                foundPost.likes.push(req.user);
              }
            });
          }
          user.save();
          res.status(200).json(foundPost);
        }
      });
    });
  });
}



// export public methods here
module.exports = {
  index: index,
  create: create,
  show: show,
  destroy: destroy,
  update: update
};
