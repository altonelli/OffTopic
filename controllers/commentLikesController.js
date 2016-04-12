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
  //
  // db.Post.findOne({_id: req.params.post})
  // .populate('comments comments.author likes comments.likes author')
  // .exec(function(err, post){
  //   console.log("post",post);
  //   post.comments.forEach(function(el){
  //     if(el._id.toString() === req.params.comment.toString()){
  //         var indexOfLike;
  //         console.log('comment',el);
  //         el.likes.forEach(function(like, index){
  //           if(like._id.toString() === req.user._id.toString()){
  //             indexOfLike = index;
  //           }
  //         });
  //         // console.log("index",indexOfLike);
  //         if(indexOfLike >= 0){
  //           el.likes.splice(indexOfLike,1);
  //         } else {
  //           el.likes.push(req.user);
  //         }
  //         el.save();
  //         post.save();
  //         console.log(post.author.posts);
  //         // post.author.posts.forEach(function(foundPost, index){
  //         //   if(foundPost._id.toString() === post._id.toString()){
  //         //     post.author.posts.splice(index,1,post);
  //         //   }
  //         // });
  //         // post.author.save();
  //         res.status(200).json(el);
  //     }
  //   });
  // });



// export public methods here
module.exports = {
  index: index,
  create: create,
  show: show,
  destroy: destroy,
  update: update
};
