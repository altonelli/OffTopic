var db = require('../models');

function index(req, res) {
  db.Post.find({}).populate('author').populate('likes').populate('comments.author').exec(function(err,posts){
    if (err) { res.status(500).json("Sorry, something went wrong on our end while finding the posts."); }
    else if (!posts) { res.status(400).json("Sorry, we couldn't find those posts."); }
    else {
      res.status(200).json(posts);
    }
  });
}

function create(req, res) {
  console.log(req.user);
  var newPost = new db.Post({
    author: req.user,
    date: new Date(),
    text: req.body.text,
    likes: [],
    comments: []
  });
  newPost.save(function(err,post){
    if (err) {
      res.status(500).json("Sorry something went wrong on our end while creating that post");
    } else if (!post) {
      res.status(400).json("Sorry, could not find that id while creating the post");
    } else {
      post.populate('author').populate('likes').populate('comments');
      res.status(200).json(post);
    }
  });

}

function show(req, res) {
  db.Post.findOne({_id:req.params.post}).populate('author').populate('likes').populate('comments').populate('comments.author').exec(function(err,post){
    if(err){res.status(500).json("Sorry, something went wrong on our end while looking for that post.");}
    else if (!post) { res.status(400).json("Sorry, we couldn't find that post");}
    else { res.status(200).json(post); }
  });
}

function destroy(req, res) {
  db.Post.findOne({_id: req.params.post}).populate('author').exec(function(err, post){
    if(err){res.status(500).json("Sorry error on our end while looking for that post.");}
    else if (!post) { res.status(400).json("Sorry, could not find that post.");}
    else {
      var postId = post._id;
      if(req.user._id.toString() === post.author._id.toString()){
        post.remove();
        res.status(200).json(postId);
      } else {
        res.status(401).json("Unauthorized");
      }
    }
  });
}

function update(req, res) {
  db.Post.findOne({_id: req.params.post}).populate('author').populate('comments').exec(function(err,post){
    if (err) { res.status(500).json("Sorry something went wrongon our end while creating that post"); }
    else if (!post) { res.status(400).json("Sorry, could not find that id while creating the post"); }
    else {
      console.log("old post",post.text);
      console.log("new post",req.body.text);
      if(req.user._id.toString() === post.author._id.toString()){
        post.text = req.body.text;
        post.save();
        res.status(200).json(post);
      } else {
        res.status(401).json("Unauthorized");
      }
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
