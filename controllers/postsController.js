var db = require('../models');
var image;

function index(req, res) {
  db.Post.find({}).populate('author likes comments.author comments.likes').exec(function(err,posts){
    if (err) { res.status(500).json("Sorry, something went wrong on our end while finding the posts."); }
    // I'm curious when this might happen on an index route.  Wouldn't returning an empty array be correct?
    else if (!posts) { res.status(400).json("Sorry, we couldn't find those posts."); }
    else {
      res.status(200).json(posts);
    }
  });
}

function create(req, res) {
  console.log('creating a post');
  var newPost = new db.Post({
    author: req.user, //cool
    date: new Date(),
    text: req.body.text,
    image: req.body.image,
    likes: [], // unnecessary
    comments: [] // unnecessary
  });
  var userPost = newPost.save(function(err,post){
    if (err) {
      res.status(500).json("Sorry something went wrong on our end while creating that post");
    } else if (!post) {
      res.status(400).json("Sorry, could not find that id while creating the post");
    } else {
      post.populate('author');//.populate('likes').populate('comments'); // new posts don't have likes or comments right?
      // console.log(post);
      res.status(200).json(post);
    }
  });

  userPost.then(function(){
    req.user.posts.push(newPost);
    req.user.save();
  });
}

function show(req, res) {
  db.Post.findOne({_id:req.params.post}).populate('author likes comments comments.author comments.likes').exec(function(err,post){
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
        post.author.posts.forEach(function(foundPost, index){
          if(foundPost._id.toString() === post._id.toString()){
            var removedPost = post.author.posts.splice(index,1);
          }
        });
        post.author.save();
        post.remove();
        res.status(200).json(postId);
      } else {
        res.status(401).json("Unauthorized");
      }
    }
  });
}

function update(req, res) {
  db.Post.findOne({_id: req.params.post}).populate('author comments comments.author comments.likes').exec(function(err,post){
    if (err) { res.status(500).json("Sorry something went wrongon our end while creating that post"); }
    else if (!post) { res.status(400).json("Sorry, could not find that id while creating the post"); }
    else {
      if(req.user._id.toString() === post.author._id.toString()){
        post.text = req.body.text;
        post.image = req.body.image;
        var postSave = post.save(function(err,post){
          if (err) { console.log("ERRRRR",err); }
          else if (!post) { console.log("NO POST"); }
          else{
            res.status(200).json(post);
          }
        });
        postSave.then(function(){
          req.user.posts.forEach(function(userPost, index){
            if (userPost._id.toString() === post._id.toString()){
              req.user.posts.splice(index,1,post);
            }
          });
          req.user.save();
        });
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
