const {Click} = require('../models/clicks-history.js');
const {Query} = require('../models/queries-history.js');

exports.getHistory = async (type, user) => {
  return await type.find({_requester: user._id}).sort({_id:-1}).limit(10);
};
