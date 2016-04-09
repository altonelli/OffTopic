// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
var bodyParser = require('body-parser');
// generate a new express app and call it 'app'
var app = express();

var mongoose = require('mongoose'),

    //  NEW ADDITIONS
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var controllers = require('./controllers');
var db = require('./models'),
  User = db.User;



// middleware for auth
app.use(cookieParser());
app.use(session({
  secret: 'supersecretkey', // change this!
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

// set view engine to hbs (handlebars)
app.set('view engine', 'hbs');

// We'll serve jQuery and bootstrap from a local bower cache avoiding CDNs
// We're placing these under /vendor to differentiate them from our own assets
// app.use('/vendor', express.static(__dirname + '/bower_components'));




/**********
 * ROUTES *
 **********/

 app.get('/', function (req, res) {
   res.render('index', {user: JSON.stringify(req.user) + "|| null" });
 });


 // AUTH ROUTES

 // show signup view
 app.get('/signup', function (req, res) {
   res.render('signup'); // you can also use res.sendFile
 });

// sign up new user, then log them in
// hashes and salts password, saves new user to db
app.post('/signup', function (req, res) {
  User.register(new User({ username: req.body.username, image: req.body.image }), req.body.password,
    function (err, newUser) {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  );
});

// show login view
app.get('/login', function (req, res) {
  res.render('login'); // you can also use res.sendFile
});

// log in user
app.post('/login', passport.authenticate('local'), function (req, res) {
  // console.log(req.user);
  res.redirect('/');
});

// log out user
app.get('/logout', function (req, res) {
  // console.log("BEFORE logout", req.user);
  req.logout();
  // console.log("AFTER logout", req.user);
  res.redirect('/');
});








/*
 * HTML Endpoints
 */

// app.get('/', function homepage (req, res) {
//   res.sendFile(__dirname + '/views/index.html');
// });

app.get('/api/posts', controllers.posts.index);

app.get('/api/posts/:post', controllers.posts.show);

app.post('/api/posts', controllers.posts.create);

app.put('/api/posts/:post', controllers.posts.update);

app.delete('/api/posts/:post', controllers.posts.destroy);

app.post('/api/posts/:post/comments', controllers.comments.create);

app.put('/api/posts/:post/comments/:comment', controllers.comments.update);

app.delete('/api/posts/:post/comments/:comment', controllers.comments.destroy);

app.get('/api/users/:user', controllers.users.show);

app.put('/api/users/:user', controllers.users.update);



/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
