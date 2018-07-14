const {User} = require('../models/user.js');
const md5 = require('MD5');
const crypto = require('crypto');

var loginUser = async (login, password) => {
  password = md5(password);

  var user = await User.findOne({login});
    console.log('user', user);

    if(!user) {
      console.log('error, no user find');
      const token = generateAccessToken();
      console.log('token', token);
      const newUser = new User({login, password, token});
      const result = await newUser.save();
        console.log('saved ', result);
      return result;
    };
    user = await User.findOne({login, password});
    console.log(user);
    if(user) {
      return user;
    };
    return user;
};

var generateAccessToken = () => {
  return crypto.randomBytes(64).toString('base64');
};

var findByToken = async (token) => {
  var user = await User.findOne({token});
  return user;
}

module.exports = {loginUser, findByToken};
