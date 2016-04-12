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
    .populate('posts posts.comments posts.comments.likes')
    .exec(function(err,user){
      user.posts.forEach(function(foundPost){
        if (foundPost._id.toString() === post._id.toString()){
          foundPost.comments.forEach(function(comment){
            console.log(comment);
            if(comment._id.toString() === req.params.comment.toString()){
              if(comment.likes.length === 0){
                comment.likes.push(req.user);
              } else {
                console.log("COMMENT",comment);
                comment.likes.forEach(function(like,index){
                  console.log("LIKE",like);
                  if(like._id.toString() === req.user._id.toString()){
                    comment.likes.splice(index,1);
                  } else if(index === comment.likes.length-1){
                    comment.likes.push(req.user);
                  }
                });
              }
              user.save();
              res.status(200).json(comment);
            }
          });
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
