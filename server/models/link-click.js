const mongoose = require('mongoose');

exports.Link = mongoose.model('Links', {
  link: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  _requester: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});
