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
    console.log("post",post);
    post.comments.forEach(function(el){
      if(el._id.toString() === req.params.comment.toString()){
          var indexOfLike;
          console.log('comment',el);
          el.likes.forEach(function(like, index){
            if(like._id.toString() === req.user._id.toString()){
              indexOfLike = index;
            }
          });
          // console.log("index",indexOfLike);
          if(indexOfLike >= 0){
            el.likes.splice(indexOfLike,1);
          } else {
            el.likes.push(req.user);
          }
          el.save();
          post.save();
          res.status(200).json(el);
      }
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
