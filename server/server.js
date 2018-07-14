const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const hbs = require('hbs');
//const VKontakteStrategy = require('passport-vkontakte').Strategy;

const {search, setAccessToken, getAccessToken} = require('./utils/vk-calls');
const {formatUsers} = require('./utils/users');
const {mongoose} = require('./db/mongoose');
const {Query} = require('./models/search-query.js');
const {Link} = require('./models/link-click.js');
const {User} = require('./models/user.js');
const {ObjectId} = require('mongodb');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const id = ObjectId("5b3f883179b68f215c17f155");

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.set('view engine', 'hbs');

app.get('/user', (req, res) => {
  res.render('user.hbs');
});

app.use(express.static(publicPath));

app.use(bodyParser.json());



io.on('connection', (socket) => {
  console.log('user connected to server');
  //console.log(socket.handshake);
  socket.on('auth', (log, pas, callback) => {
    var user = new User({
      login: log,
      password: pas
    });
    user.save().then((res) => {
      console.log('saved ', res);
      callback();
      Query.find({_requester: id}).sort({_id:-1}).limit(10).then((queries) => {
        Link.find({_requester: id}).sort({_id:-1}).limit(10).then((links) => {
          socket.emit('updateHistory', {queries, links});
        });
      });

    }, (e) => {
      console.log('unable to save');
      callback('unable to save user');
    });
  });

  socket.on('checkToken', (callback) => {
    var token = getAccessToken();
    if(token) {
      callback(token);
    } else {
      callback();
    }
  });

  socket.on('token', (token) => {
    setAccessToken(token);
  });

  socket.on('linkClick', (link, text, callback) => {
    var link = new Link({
      link,
      text,
      _requester: id
    });
    link.save().then((res) => {
      Link.find({_requester: id}).sort({_id:-1}).limit(10).then((links) => {
      callback(links)
      });
    }, (e) => {
      console.log('unable to save');
    });
  });

  socket.on('search', (q) => {
    var query = new Query({
      query: q,
      _requester:id
    });
    query.save().then((res) => {
      console.log('saved ', res);
    }, (e) => {
      console.log('unable to save');
    });

    search(q).then(res => {

      socket.emit('searchResult', formatUsers(res));

    }).catch(console.log);

  });
});

server.listen(port, () => {
  console.log(`Server up at port ${port}`);
});
