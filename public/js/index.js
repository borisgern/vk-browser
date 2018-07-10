var socket = io();

socket.on('connect', function () {
  console.log('connected to server');
});

socket.on('searchResult', function (res) {
  console.log(res);

  res.forEach(function (user) {
    var template = $('#search-result-template').html();
    var html = Mustache.render(template, {
      photo: user.photo,
      first_name: user.first_name,
      last_name: user.last_name,
      sex: user.sex,
      link: user.link,
      userID: user.userID,
      bdate: user.bdate,
      country: user.country,
      city: user.city
    });
    //console.log(html);
    $('#search-result').append(html);

    template = $('#post-template').html();
    user.posts.forEach(function (post) {
      html = Mustache.render(template, {
        photo: post.photo,
        date: post.date,
        text: post.text,
        link: post.link,
      });
      //console.log(html);
      $(`#post-${user.userID}`).append(html);
    });

  });


});

$('#search-form').submit(function (e) {
  e.preventDefault();
  var data = $('[name=search-bar]').val();
  socket.emit('search', data);
});

$('#authorization-form').submit(function (e) {
  e.preventDefault();
  var log = $('[name=login]').val();
  var pas = $('[name=password]').val();
  socket.emit('auth', log, pas);
});
