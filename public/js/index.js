var socket = io();

socket.on('connect', function () {
  console.log('connected to server');

  if(window.location.hash) {
    socket.emit('token', $.deparam(window.location.hash.substr(1)).access_token)
  }

});

socket.on('searchResult', function (res) {
  console.log(res);
  $('#search-status').text('');
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

socket.on('updateSearchHistory', function (history) {
  $('#search-history').empty();
  history.forEach(function (query) {
    var template = $('#search-history-template').html();
    var html = Mustache.render(template, {
      text: query.query
    });
    $(`#search-history`).append(html);
  });
});

$('#search-form').submit(function (e) {
  e.preventDefault();
  var data = $('[name=search-bar]').val();

  socket.emit('checkToken', function (token) {
    if(!token) {
      var domain = window.location.origin;
      window.location.href = `https://oauth.vk.com/authorize?client_id=6625040&display=page&response_type=token&scope=offline&v=5.52&redirect_uri=${domain}`;
    } else {
      $('#search-result').empty();
      $('#search-status').text('Идет поиск...');
      socket.emit('search', data);
    }
  });

});

$('body').on('click', '#vk-link', function(e) {
  var link = e.target.href;
  var text = e.target.text;
  socket.emit('linkClick', link, text, function(history) {
    $('#click-history').empty();
    history.forEach(function (link) {
      var template = $('#click-history-template').html();
      var html = Mustache.render(template, {
        text: link.text,
        link: link.link
      });
      $(`#click-history`).append(html);
    });
  });
});

$('#authorization-form').submit(function(e) {
  e.preventDefault();
  var log = $('[name=login]').val();
  var pas = $('[name=password]').val();
  socket.emit('auth', log, pas);
});
