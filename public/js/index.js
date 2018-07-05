var socket = io();

socket.on('connect', function () {
  console.log('connected to server');
});

$('#search-form').submit(function (e) {
  console.log('click');
  e.preventDefault();
  $('#search-result').append('<li>text</li>');
});
var params = 2;
socket.emit('join', params);
