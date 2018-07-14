const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const hbs = require('hbs');
//const VKontakteStrategy = require('passport-vkontakte').Strategy;

const {search, setAccessToken, getAccessToken} = require('./utils/vk-calls');
const {formatUsers} = require('./utils/formatVkData');
const {findByToken, loginUser} = require('./utils/auth');
const {getHistory} = require('./utils/history');
const {mongoose} = require('./db/mongoose');
const {Query} = require('./models/queries-history');
const {Click} = require('./models/clicks-history');
const {User} = require('./models/user');
const {ObjectId} = require('mongodb');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const id = ObjectId("5b3f883179b68f215c17f155");

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.use(bodyParser.json());



io.on('connection', (socket) => {
  console.log('user connected to server');

  socket.on('authByToken', (token, callback) => {
    console.log(token);
    findByToken(token).then((user) => {
      getHistory(Click, user).then((history) => {
        console.log('history', history);
        callback(history);
        getHistory(Click, user).then((clicks) => {
          socket.emit('updateClicksHistory', clicks);
        });
        getHistory(Query, user).then((queries) => {
          socket.emit('updateQueriesHistory', queries);
        });
        });
      callback(user);
    });
  });

  socket.on('authByLogPas', (login, password, callback) => {
    console.log(login,password);
    loginUser(login, password).then((user) => {
      console.log('callback', user);
      if(user) {
          callback(user);
          getHistory(Click, user).then((clicks) => {
            socket.emit('updateClicksHistory', clicks);
          });
          getHistory(Query, user).then((queries) => {
            socket.emit('updateQueriesHistory', queries);
          });
      } else {
        callback();
      }
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

  socket.on('VKtoken', (token) => {
    setAccessToken(token);
  });

  socket.on('linkClick', (link, text, token) => {

    findByToken(token).then((user) => {
      var click = new Click({
        link,
        text,
        _requester: user._id
      });
      click.save().then((res) => {
        getHistory(Click, user).then((clicks) => {
          console.log('history', clicks);
          socket.emit('updateClicksHistory', clicks);
          });
        }, (e) => {
          console.log('unable to save');
        });
      });
    });

  socket.on('search', (q, token) => {

    if (token) {
      findByToken(token).then((user) => {
        var query = new Query({
          query: q,
          _requester:user._id
        });
        query.save().then((res) => {
          console.log('saved ', res);
          getHistory(Query, user).then((queries) => {
            socket.emit('updateQueriesHistory', queries);
          });
        }, (e) => {
          console.log('unable to save');
        });

      });
    };

    search(q).then(res => {

      socket.emit('searchResult', formatUsers(res));

    }).catch(console.log);

  });
});

server.listen(port, () => {
  console.log(`Server up at port ${port}`);
});
