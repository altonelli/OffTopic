var db = require("./models");


db.User.find({}).exec(function(err,users){
  if(err){ console.log("ERROR",err);}
  else if (!users) {console.log("no users"); }
  else{
    users.forEach(function(user){
      console.log(user);
      db.Post.find({}).populate('author').exec(function(err,posts){
        if(err){ console.log("ERROR",err); }
        else if (!posts) { console.log("No posts"); }
        else {
          console.log("POSTS",posts);
          posts.forEach(function(post){
            console.log(post.author._id.toString());
            console.log(user._id.toString());
            if (post.author._id.toString() === user._id.toString()){
              console.log("INIF");
              user.posts.push(post);
              user.save();
              console.log(user);
            }
          });
        }
      });
      console.log("USER",user.username,"UPDATED WITH",user.posts.length,"POSTS");
    });
  }
});
