var socket = io();

var generateTemplateLoggedIn = function (log, token) {
  localStorage.token = token;
  $('#authorization-form').empty();
  var template = $('#logout-template').html();
  var html = Mustache.render(template, {
    username: log
  });
  $('#authorization-form').append(html);

  template = $('#history-template').html();
  html = Mustache.render(template);
  $('#history').append(html);
};

var generateTemplateClicksHistory = function (histories) {
  $('#click-history').empty();
  if(histories.text !== null) {
    histories.forEach(function (history) {
      var template = $('#click-history-template').html();
      var html = Mustache.render(template, {
        text: history.text,
        link: history.link
      });
      $(`#click-history`).append(html);
    });
  };
};

var generateTemplateQueriesHistory = function (histories) {
  $('#search-history').empty();
  console.log('history',histories);
  histories.forEach(function (history) {
    console.log(history.query);
    var template = $('#search-history-template').html();
    var html = Mustache.render(template, {
      text: history.query
    });
    $('#search-history').append(html);
  });

  //generateTemplateClicksHistory(histories);
};

socket.on('connect', function () {
  console.log('connected to server');

  if(window.location.hash) {
    socket.emit('VKtoken', $.deparam(window.location.hash.substr(1)).access_token)
  }

  socket.emit('authByToken', localStorage.token, function(user) {
    console.log('user', user);

    if(user && user.token === localStorage.token) {
      generateTemplateLoggedIn(user.login, user.token);
      //generateTemplateQueriesHistory()/////
    } else {
      $('#authorization-form').empty();
      var template = $('#login-template').html();
      var html = Mustache.render(template);
      $('#authorization-form').append(html);
    }
  });


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

socket.on('updateQueriesHistory', function (history) {
  generateTemplateQueriesHistory(history);
});

socket.on('updateClicksHistory', function (history) {
  generateTemplateClicksHistory(history);
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
      socket.emit('search', data, localStorage.token);
    }
  });

});

$('body').on('click', '#vk-link', function(e) {
  var link = e.target.href;
  var text = e.target.text;
  if(localStorage.token) {
    socket.emit('linkClick', link, text, localStorage.token);
  }
});

$('body').on('click', '#login-button', function(e) {
    e.preventDefault();
    var log = $('[name=login]').val();
    var pas = $('[name=password]').val();
    if(log && pas) {
      socket.emit('authByLogPas', log, pas, function(user) {
        console.log(user);
        if(user) {
          generateTemplateLoggedIn(log, user.token);
        } else {
          alert(`Неправильный пароль для ${log}`);
        }
      });
    } else {
      alert('Введите логин и пароль');
    }
});

$('body').on('click', '#logout-button', function(e) {
    e.preventDefault();
    $('#authorization-form').empty();
    $('#history').empty();
    var template = $('#login-template').html();
    var html = Mustache.render(template);
    $('#authorization-form').append(html);
    delete localStorage.token;
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');

});
