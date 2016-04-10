var db = require('../models');

function index(req, res) {

}

function create(req, res) {
  console.log('text:',req.body.text);
  var newComment = new db.Comment({
    author: req.user,
    text: req.body.text,
    date: new Date(),
    image: req.body.image,
    likes: []
  });
  db.Post.findOne({_id: req.params.post})
  .populate('author')
  .populate('likes')
  .populate('comments.author')
  .populate('comments.likes')
  .exec(function(err,post){
    if (err) { res.status(500).json("Sorry, something went wrong on our end while creating that comment."); }
    else if (!post) { res.status(400).json("Sorry, could not find that post to apply the comment."); }
    else {
      newComment.populate('author author.posts');
      post.comments.push(newComment);
      post.save();
      post.author.posts.forEach(function(foundPost, index){
        if(foundPost._id.toString() === post._id.toString()){
          post.author.posts.splice(index,1,post);
        }
      });
      post.author.save();
      res.status(200).json(newComment);
    }
  });
}

function show(req, res) {

}

function destroy(req, res) {
  db.Post.findOne({_id: req.params.post}).populate('author comments comments.author').exec(function(err,post){
    if(err){ res.status(500).json('Sorry, something went wrong on our end while looking for that post');}
    else if (!post) { res.status(400).json('Sorry, we could not find that post'); }
    else {
      post.comments.forEach(function(comment, index){
        if (comment._id.toString() === req.params.comment){
          var commentId = comment._id;
          if (req.user._id.toString() === comment.author._id.toString()){
            comment.remove(function(err,comment){
              if (err) { console.log(err); }
              else{
                console.log("post",post);
                post.save();
                post.author.posts.forEach(function(foundPost, index){
                  if(foundPost._id.toString() === post._id.toString()){
                    post.author.posts.splice(index,1,post);
                  }
                });
                post.author.save();
                res.status(200).json(commentId);
              }
            });
          } else {
            res.status(401).json("Unauthorized");
          }
        }
      });
    }
  });
}

function update(req, res) {
  db.Post.findOne({_id: req.params.post}).populate('author comments likes comments.author').exec(function(err,post){
    if(err){ res.status(500).json('Sorry, something went wrong on our end while looking for that post');}
    else if (!post) { res.status(400).json('Sorry, we could not find that post'); }
    else {
      post.comments.forEach(function(comment){
        if (comment._id.toString() === req.params.comment){
          if(req.user._id.toString() === comment.author._id.toString()){
            comment.text = req.body.text;
            comment.image = req.body.image;
            comment.save();
            console.log(comment);
            post.save();
            post.author.posts.forEach(function(foundPost, index){
              if(foundPost._id.toString() === post._id.toString()){
                post.author.posts.splice(index,1,post);
              }
            });
            post.author.save();
            res.status(200).json(comment);
          } else {
            res.status(401).json("Unauthorized");
          }
        }
      });
    }
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
