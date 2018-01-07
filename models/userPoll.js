const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  description:String,
  voteCount:Number
});
const pollSchema = new Schema({
  pollName:String,
  options:[optionSchema]
});
const userPollSchema = new Schema({
  userName: String,
  email: String,
  password: String,
  polls: [pollSchema]
});
const UserPoll = mongoose.model('userPoll', userPollSchema);
// const userSchema = new Schema({
//   userName: String,
//   email: String,
//   password: String
// });
// const User = mongoose.model('user', userSchema);
//
// const pollSchema = new Schema({
//   pollName: String,
//   options: Array
// });
// const Poll = mongoose.model('poll', pollSchema);
module.exports = UserPoll;
// module.exports = {User:User, Poll:Poll};
// module.exports = Poll;
