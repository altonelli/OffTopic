var db = require('../models');

function index(req, res) {
  db.User.findOne({_id: req.user._id}).populate('friends').exec(function(err,user){
    if(err){res.status(500).json("Error on our end while searching for your friends");}
    else if (!user) {res.status(400).json("Sorry, we couldn't find you."); }
    else {
        res.status(200).json(user.friends);
    }
  });
}

function create(req, res) {
  db.User.findOne({_id: req.params.user}).populate('friends').exec(function(err,user){
    db.User.findOne({_id: req.params.friend}, function(err,newFriend){
      var isFriend;
      user.friends.forEach(function(friend){
        if( friend._id.toString() === newFriend._id.toString() ){
          isFriend = true;
        }
      });
      if(isFriend){
        res.status(200).json("Already a friend");
      } else {
        user.friends.push(newFriend);
        user.save();
        res.status(200).json(newFriend);
      }
    });
  });
}

function show(req, res) {

}

function destroy(req, res) {
  db.User.findOne({_id: req.params.user}).populate('friends').exec(function(err,user){
    db.User.findOne({_id: req.params.friend}, function(err,foe){
      var indexOfFriend;
      user.friends.forEach(function(friend,index){
        if( friend._id.toString() === foe._id.toString() ){
          indexOfFriend = index;
        }
      });
      if(indexOfFriend >= 0){
        var deletedFriend = user.friends.splice(indexOfFriend,1);
        user.save();
        res.status(200).json(deletedFriend[0]);
      } else {
        res.status(200).json("Not friend");
      }
    });
  });
}

function update(req, res) {

}



// export public methods here
module.exports = {
  index: index,
  create: create,
  show: show,
  destroy: destroy,
  update: update
};
