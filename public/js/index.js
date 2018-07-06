var socket = io();

socket.on('connect', function () {
  console.log('connected to server');
});

socket.on('searchResult', function (res) {
  console.log(res);
  var template = $('#search-result-template').html();
  for(var i = 0; i < res.items.length; i++) {

    var postsText = [];
    res.items[i].posts.forEach(function (post) {
      if(!post.text) {
        post.text = 'У этого поста нет текста'
      }
      postsText.push(post.text);
    });

    if(!res.items[i].about) {
      res.items[i].about = 'Нет информации';
    }
    if(!res.items[i].city) {
      res.items[i].city = {};
      res.items[i].city.title = 'Нет информации';
    }
    if(!res.items[i].country) {
      res.items[i].country = {};
      res.items[i].country.title = 'Нет информации';
    }
    switch(res.items[i].sex) {
    case 1:
        res.items[i].sex = 'жен';
        break;
    case 2:
        res.items[i].sex = 'муж';
        break;
    default:
        res.items[i].sex = 'не определился';
    }
    var html = Mustache.render(template, {
      photo: res.items[i].photo_200_orig,
      first_name: res.items[i].first_name,
      last_name: res.items[i].last_name,
      sex: res.items[i].sex,
      link: `https://vk.com/id${res.items[i].id}`,
      posts: postsText,
      bdate: res.items[i].bdate,
      country: res.items[i].country.title,
      city: res.items[i].city.title
    });
    //console.log(html);
    $('#search-result').append(html);
  }
});

$('#search-form').submit(function (e) {
  e.preventDefault();
  var data = $('[name=search-bar]').val();
  socket.emit('search', data);
});
