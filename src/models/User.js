const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
  },
  email : {
    type : String,
    required : true,
    unique : true,
  },
  userId : {
    type : String,
    required : true,
  },
  password : {
    type : String,
    required : true,
  },
  isAdmin : {
    type : Boolean,
    default : false,
  },
  createdAt : {
    type : Date,
    default : Date.now(),
  },
  lastModifiedAt : {
    type : Date,
    default : Date.now()
  }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;