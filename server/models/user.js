const mongoose = require('mongoose');

exports.User = mongoose.model('Users', {
  login: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  token: {
      type: String,
      required: true
    }
});
