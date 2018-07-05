const {VK} = require('vk-io');

const vk = new VK();

vk.setToken('b2fbf62cb2fbf62cb2fbf62cddb29ee13cbb2fbb2fbf62ce9c5f188211044f458657591');

exports.search = async (q) => {
    // const response = await vk.api.wall.get({
    //     owner_id: 3275552
    // });
    return response = await vk.api.call('users.search', {
        access_token: '63c14f40b96926f253d9cb084a625fcf7ad6f4978b831a3fcca8adf54f16878fd9b81254b9312c448e1b5',
        q,
        count: 1,
        fields: 'photo, about'
    });

//https://oauth.vk.com/authorize?client_id=6625040&display=page&response_type=token&v=5.52
//63c14f40b96926f253d9cb084a625fcf7ad6f4978b831a3fcca8adf54f16878fd9b81254b9312c448e1b5
    //console.log(response);
}
