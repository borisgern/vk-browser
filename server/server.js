const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {search} = require('./utils/vk-calls');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('user connected to server');

  socket.on('search', (q) => {
    search(q).then(res => {console.log(res);}).catch(console.log);
  });
});



server.listen(port, () => {
  console.log(`Server up at port ${port}`);
});
