var db = require('../models');

function index(req, res) {
  db.Post.find({},function(err,posts){
    if (err) { res.status(500).json("Sorry, something went wrong on our end while finding the posts."); }
    else if (!posts) { res.status(400).json("Sorry, we couldn't find those posts."); }
    else { res.status(200).json(posts); }
  });
}

function create(req, res) {
  var newPost = new db.Post({
    author: "Arthur",
    date: new Date(),
    text: req.body.text,
    likes: 0,
    comments: []
  });
  newPost.save(function(err,post){
    if (err) {
      res.status(500).json("Sorry something went wrongon our end while creating that post");
    } else if (!post) {
      res.status(400).json("Sorry, could not find that id while creating the post");
    } else {
      res.status(200).json(post);
    }
  });

}

function show(req, res) {
  db.Post.findOne({_id:req.params.post}).populate('Comment').exec(function(err,post){
    if(err){res.status(500).json("Sorry, something went wrong on our end while looking for that post.");}
    else if (!post) { res.status(400).json("Sorry, we couldn't find that post");}
    else { res.status(200).json(post); }
  });
}

function destroy(req, res) {
  db.Post.findOneAndRemove({_id: req.params.post}, function(err, post){
    if(err){res.status(500).json("Sorry error on our end while looking for that post.");}
    else if (!post) { res.status(400).json("Sorry, could not find that post.");}
    else { res.status(200).json(post);}
  });
}

function update(req, res) {
  db.Post.findOne({_id: req.params.post}, function(err,post){
    if (err) { res.status(500).json("Sorry something went wrongon our end while creating that post"); }
    else if (!post) { res.status(400).json("Sorry, could not find that id while creating the post"); }
    else {
      post.text = req.body.text;
      post.likes += parseInt(req.body.likes);
      post.save();
      res.status(200).json(post);
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
