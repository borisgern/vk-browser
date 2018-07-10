const {VK} = require('vk-io');
const vk = new VK();
const { auth } = vk;


const token = 'b2fbf62cb2fbf62cb2fbf62cddb29ee13cbb2fbb2fbf62ce9c5f188211044f458657591';
var access_token;

vk.setToken(token);

exports.setAccessToken = (token) => {
  access_token = token;
};

exports.getAccessToken = () => {
  if(access_token) {
    return true;
  }
  return false;
};

exports.search = async (q) => {
  var users = await vk.api.call('users.search', {
      access_token: access_token,
      q,
      count: 10,
      fields: 'photo_200_orig, sex, bdate, city, country'
  });

  for(var i = 0; i < users.items.length; i++) {
    var posts = await vk.api.wall.get({
      owner_id: users.items[i].id,
      count: 5,
      access_token: access_token
    });
    users.items[i].posts = posts.items.filter(post => post);
  }
  return users
}
