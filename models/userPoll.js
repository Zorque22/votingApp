const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: String,
  email: String,
  password: String
});
const User = mongoose.model('user', userSchema);

const pollSchema = new Schema({
  pollName: String,
  options: Array
});
const Poll = mongoose.model('poll', pollSchema);

module.exports = {User:User, Poll:Poll};
// module.exports = Poll;
