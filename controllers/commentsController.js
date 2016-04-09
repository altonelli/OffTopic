var db = require('../models');

function index(req, res) {

}

function create(req, res) {
  var newComment = new db.Comment({
    author: req.user,
    text: req.body.text,
    date: new Date(),
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
      newComment.populate('author');
      post.comments.push(newComment);
      post.save();
      res.status(200).json(newComment);
    }
  });
}

function show(req, res) {

}

function destroy(req, res) {
  db.Post.findOne({_id: req.params.post}).populate('comments').populate('comments.author').exec(function(err,post){
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
                post.save();
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
  db.Post.findOne({_id: req.params.post}).populate('comments').populate('likes').populate('comments.author').exec(function(err,post){
    if(err){ res.status(500).json('Sorry, something went wrong on our end while looking for that post');}
    else if (!post) { res.status(400).json('Sorry, we could not find that post'); }
    else {
      post.comments.forEach(function(comment){
        if (comment._id.toString() === req.params.comment){
          if(req.user._id.toString() === comment.author._id.toString()){
            comment.text = req.body.text;
            comment.save();
            console.log(comment);
            post.save();
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
