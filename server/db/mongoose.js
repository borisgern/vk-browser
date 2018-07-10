const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VKbrowser', { useNewUrlParser: true });

module.exports = {mongoose};
