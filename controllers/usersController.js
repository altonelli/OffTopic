var db = require('../models');

function index(req, res) {

}

function create(req, res) {

}

function show(req, res) {
  db.User.find({username: req.params.user}, function(err,users){
    if (err) { res.status(500).json('Sorry, something when wrong on our end while searching for that user.');}
    else if (!users) { res.status(400).json('Sorry, could not find that user'); }
    else {
      res.status(200).json(users);
    }
  });
}

function destroy(req, res) {

}

function update(req, res) {
  console.log(req.params.user);
  console.log(req.body._id);
  db.User.findOne({_id: req.params.user}, function(err,user){
    if (err) {res.status(500).json("Sorry, something went wrong on our end while looking up your profile.");}
    else if (!user) {res.status(400).json("Sorry, you don't exist."); }
    else{
      console.log("current", user);
      var currentUser = user;
      currentUser.populate('friends');
      db.User.findOne({_id: req.body._id}, function(err,user){
        if (err) {res.status(500).json("Sorry, something went wrong on our end while looking up that profile.");}
        else if (!user) {res.status(400).json("Sorry, they don't exist."); }
        else{
          console.log("friend", user);
          if(req.params.type === "add"){
            console.log("adding");
            currentUser.friends.push(user);
            res.status(200).json(currentUser);
          } else if(req.params.type === "remove") {
            console.log("deleting");
            currentUser.friends.forEach(function(friend, index){
              if(friend._id === user._id){
                currentUser.friends.splice(index,1);
                res.status(200).json(currentUser);
              }
            });
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
