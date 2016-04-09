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

}



// export public methods here
module.exports = {
  index: index,
  create: create,
  show: show,
  destroy: destroy,
  update: update
};
