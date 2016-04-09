var db = require("./models");

var userList = [
  {
    username: "Pikachu",
    password: String,
    image: "http://vignette2.wikia.nocookie.net/pokemon/images/e/ef/025Pikachu_Pokemon_Mystery_Dungeon_Red_and_Blue_Rescue_Teams.png/revision/latest?cb=20150105233050",
    description: "I am yellow.",
    posts: [],
    friends: [],
  },
  {
    username: "Squirtle",
    password: String,
    image: "http://vignette3.wikia.nocookie.net/pokemon/images/1/13/007Squirtle_Pokemon_Mystery_Dungeon_Explorers_of_Sky.png/revision/latest?cb=20150105230449",
    description: "I am blue.",
    posts: [],
    friends: [],
  },
  {
    username: "Bulbasaur",
    password: String,
    image: "http://vignette1.wikia.nocookie.net/pokemon/images/b/b8/001Bulbasaur_Dream.png/revision/latest?cb=20140903033758",
    description: "I am green.",
    posts: [],
    friends: [],
  },
  {
    username: "Charmander",
    password: String,
    image: "http://vignette4.wikia.nocookie.net/pokemon/images/5/55/004Charmander_OS_anime_3.png/revision/latest?cb=20150330015131",
    description: "I am red.",
    posts: [],
    friends: [],
  }
];

var postList = [
  {
    author: {},
    date: "1/1/2016",
    text: "What is going on tonight?",
    likes: [],
    comments: []
  },
  {
    author: {},
    date: "1/1/2016",
    text: "Just got a new gym badge!",
    likes: [],
    comments: []
  },
  {
    author: {},
    date: "1/1/2016",
    text: "Gotta catch'em all!",
    likes: [],
    comments: []
  },
  {
    author: {},
    date: "1/1/2016",
    text: "Pokemon!",
    likes: [],
    comments: []
  },
];

var commentList = [
  {
    author: {},
    date: "12/31/2016",
    text: "This is a waste of time",
    likes: [],
  },
  {
    author: {},
    date: "12/31/2016",
    text: "Cool!",
    likes: [],
  },
  {
    author: {},
    date: "12/31/2016",
    text: "Have fun!",
    likes: [],
  },
  {
    author: {},
    date: "12/31/2016",
    text: "Going to the gym!",
    likes: [],
  },
];


db.User.remove({},function(err,users){
  db.Post.remove({}, function(err, posts){
    db.User.create(userList, function(err,users){
      if(err) { return console.log('ERROR',err); }
      else {
        console.log("created",users.length,"users");
        users.forEach(function(user){
          commentList.forEach(function(comment){
            comment.author = user;
            comment.likes = users;
          });
        users.forEach(function(user){
          postList.forEach(function(post){
            post.author = user;
            post.likes = users;
            post.comments = commentList;
          });
          db.Post.create(postList, function(err,posts){
            if(err){return console.log('ERROR',err);}
            else{
              console.log("created",posts.length,"posts");
              console.log(posts);
            }
          });
        });
        // process.exit();
        });
      }
    });
  });
});
