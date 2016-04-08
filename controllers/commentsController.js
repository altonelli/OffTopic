var db = require('../models');

function index(req, res) {

}

function create(req, res) {
  var newComment = new db.Comment({
    author: 'Arthur',
    text: req.body.text,
    date: new Date(),
    likes: 0
  });
  db.Post.findOne({_id: req.params.post}).populate('Post').exec(function(err,post){
    if (err) { res.status(500).json("Sorry, something went wrong on our end while creating that comment."); }
    else if (!post) { res.status(400).json("Sorry, could not find that post to apply the comment."); }
    else {
      post.comments.push(newComment);
      post.save();
      res.status(200).json(newComment);
    }
  });
}

function show(req, res) {

}

function destroy(req, res) {
  db.Post.findOne({_id: req.params.post}).populate('Comment').exec(function(err,post){
    if(err){ res.status(500).json('Sorry, something went wrong on our end while looking for that post');}
    else if (!post) { res.status(400).json('Sorry, we could not find that post'); }
    else {
      post.comments.forEach(function(comment, index){
        if (comment._id.toString() === req.params.comment){
          var commentId = comment._id;
          comment.remove(function(err,comment){
            if (err) { console.log(err); }
            else{
              post.save();
              console.log(commentId);
              res.status(200).json(commentId);
            }
          });
        }
      });
    }
  });
}

function update(req, res) {
  console.log(req.params);
  db.Post.findOne({_id: req.params.post}).populate('Comment').exec(function(err,post){
    if(err){ res.status(500).json('Sorry, something went wrong on our end while looking for that post');}
    else if (!post) { res.status(400).json('Sorry, we could not find that post'); }
    else {
      post.comments.forEach(function(comment){
        if (comment._id.toString() === req.params.comment){
          comment.text = req.body.text;
          comment.likes += parseInt(req.body.likes);
          comment.save();
          post.save();
          res.status(200).json(comment);
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