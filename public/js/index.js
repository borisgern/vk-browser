var socket = io();

socket.on('connect', function () {
  console.log('connected to server');
});

$('#search-form').submit(function (e) {
  console.log('click');
  e.preventDefault();
  var data = $('[name=search-bar]').val();
  socket.emit('search', data);
  //$('#search-result').append('<li>text</li>');
});
