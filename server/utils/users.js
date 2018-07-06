const moment = require('moment');

exports.formatUsers = (users) => {
  var formatedUsers = [];
  users.items.forEach((user) => {
    if(!user.city) {
      user.city = {};
      user.city.title = 'Нет информации';
    }

    if(!user.country) {
      user.country = {};
      user.country.title = 'Нет информации';
    }

    switch(user.sex) {
    case 1:
        user.sex = 'жен';
        break;
    case 2:
        user.sex = 'муж';
        break;
    default:
        user.sex = 'не определился';
    }

    var formatedPosts = [];
    user.posts.forEach((post) => {
      if(post.attachments) {
        if(post.attachments[0].type === 'photo') {
          formatedPosts.push({
            photo: post.attachments[0].photo.sizes[3].url,
            date: moment.unix(post.date).format('MMM Do, YYYY'),
            text: post.text,
            link: `https://vk.com/id${user.id}?w=wall${user.id}_${post.id}`,
          });
        }
      } else {
        formatedPosts.push({
          photo: '',
          date: moment.unix(post.date).format('MMM Do, YYYY'),
          text: post.text,
          link: `https://vk.com/id${user.id}?w=wall${user.id}_${post.id}`,
        });
      }
    //  console.log('new post ',post.attachments);

    });

    formatedUsers.push({
      photo: user.photo_200_orig,
      first_name: user.first_name,
      last_name: user.last_name,
      sex: user.sex,
      link: `https://vk.com/id${user.id}`,
      posts: formatedPosts,
      userID: user.id,
      bdate: user.bdate,
      country: user.country.title,
      city: user.city.title
    });
  });
  return formatedUsers;
};
