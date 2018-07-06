const {VK} = require('vk-io');
const vk = new VK();

const token = 'b2fbf62cb2fbf62cb2fbf62cddb29ee13cbb2fbb2fbf62ce9c5f188211044f458657591';
const access_token = '63c14f40b96926f253d9cb084a625fcf7ad6f4978b831a3fcca8adf54f16878fd9b81254b9312c448e1b5';

vk.setToken(token);

//https://oauth.vk.com/authorize?client_id=6625040&display=page&response_type=token&v=5.52
//63c14f40b96926f253d9cb084a625fcf7ad6f4978b831a3fcca8adf54f16878fd9b81254b9312c448e1b5

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
