var socket = io();

socket.on('connect', function () {
  console.log('connected to server');
});

socket.on('searchResult', function (res) {

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
    var html = Mustache.render(template, {
      photo: res.items[i].photo_200_orig,
      first_name: res.items[i].first_name,
      last_name: res.items[i].last_name,
      about: res.items[i].about,
      link: `https://vk.com/id${res.items[i].id}`,
      posts: postsText
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
