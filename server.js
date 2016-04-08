// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
var bodyParser = require('body-parser');
// generate a new express app and call it 'app'
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

// We'll serve jQuery and bootstrap from a local bower cache avoiding CDNs
// We're placing these under /vendor to differentiate them from our own assets
app.use('/vendor', express.static(__dirname + '/bower_components'));

var controllers = require('./controllers');
var db = require('./models');




/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/posts', controllers.posts.index);

app.get('/api/posts/:post', controllers.posts.show);

app.post('/api/posts', controllers.posts.create);

app.put('/api/posts/:post', controllers.posts.update);

app.delete('/api/posts/:post', controllers.posts.destroy);

app.post('/api/posts/:post/comments', controllers.comments.create);

app.put('/api/posts/:post/comments/:comment', controllers.comments.update);

app.delete('/api/posts/:post/comments/:comment', controllers.comments.destroy);



/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
