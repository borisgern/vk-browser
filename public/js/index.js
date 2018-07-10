var socket = io();

socket.on('connect', function () {
  console.log('connected to server');

  if(window.location.hash) {
    socket.emit('token', $.deparam(window.location.hash.substr(1)).access_token)
  }

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

    $('#search-result').append(html);

    template = $('#post-template').html();
    user.posts.forEach(function (post) {
      html = Mustache.render(template, {
        photo: post.photo,
        date: post.date,
        text: post.text,
        link: post.link,
      });

      $(`#post-${user.userID}`).append(html);
    });

  });


});

$('#search-form').submit(function (e) {
  e.preventDefault();
  var data = $('[name=search-bar]').val();

  socket.emit('checkToken', function (token) {
    if(!token) {
      var domain = window.location.origin;
      window.location.href = `https://oauth.vk.com/authorize?client_id=6625040&display=page&response_type=token&v=5.52&redirect_uri=${domain}`;
    } else {
      socket.emit('search', data);
    }
  });

});

$('#authorization-form').submit(function (e) {
  e.preventDefault();
  var log = $('[name=login]').val();
  var pas = $('[name=password]').val();
  socket.emit('auth', log, pas);
});
