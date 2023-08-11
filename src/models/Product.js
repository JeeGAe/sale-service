const mongoose = require('mongoose');
const { Types : { ObjectId } } = mongoose;

const ProductSchema = mongoose.Schema({
  category : {
    type : String,
    required : true,
    trim : true,
  },
  name : {
    type : String,
    required : true,
    trim : true,
  },
  description : {
    type : String,
  },
  imgUrl : {
    type : String,
    required : true,
    trim : true,
  },
  user : {
    type : ObjectId,
    required : true,
    ref : 'User',
  },
  createdAt : {
    type : Date,
    default : Date.now(),
  },
  lastModifiedAt : {
    type : Date,
    default : Date.now(),
  }
})

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;