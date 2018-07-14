const mongoose = require('mongoose');

exports.Query = mongoose.model('Queries', {
  query: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  _requester: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});
