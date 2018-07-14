const mongoose = require('mongoose');

exports.Click = mongoose.model('Clicks', {
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
