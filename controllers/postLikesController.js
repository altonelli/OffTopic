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
  .populate('comments comments.author likes comments.likes author')
  .exec(function(err, post){
    db.User.findOne({_id: req.params.like}, function(err, user){
      var indexOfLike;
      console.log(post);
      post.likes.forEach(function(like, index){
        if(like._id.toString() === user._id.toString()){
          console.log('like',like);
          console.log('user',user);
          indexOfLike = index;
        }
      });
      console.log("index",indexOfLike);
      if(indexOfLike >= 0){
        post.likes.splice(indexOfLike,1);
      } else {
        post.likes.push(user);
      }
      post.save();
      res.status(200).json(post);
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
