const express = require('express');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const expressAsyncHandler = require('express-async-handler');
const auth = require('../../auth');
const { isAuth, isAdmin } = auth;
const { Types : { ObjectId } } = mongoose;


const router = express.Router();

// 전체 상품 목록 조회
router.get('/', isAuth, expressAsyncHandler(async (req, res, next) =>{
  const products = await Product.find({ user : req.user._id }).populate('user');
  if(products.length === 0){
    res.status(404).json({ code : 404, message : "Product is not found"});
  }else{
    res.json({ code: 200, products })
  }
}))
// 특정 상품 조회
router.get('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const searchProduct = await Product.findOne({
     _id : req.params.id,
     user : req.user._id, }).populate('user');
  if(!searchProduct){
    res.status(404).json({ code : 404, message : "Product is not found"});
  }else{
    res.json({ code : 200, searchProduct });
  }
}))
// // 상품 등록
router.post('/', isAuth, expressAsyncHandler(async (req, res, next) => {
  const searchProduct = await Product.findOne({ name : req.body.name })
  if(searchProduct){
    res.status(401).json({ code : 401, message : "중복 상품"});
  }else{
    const product = new Product({
      category : req.body.category,
      name :  req.body.name,
      description : req.body.description,
      imgUrl : req.body.imgUrl,
      user : new ObjectId(req.user._id),
    })
    const newProduct = await product.save();
    
    if(!newProduct){
      res.status(401).json({ code : 401, message : "Invalid Product data"})
    }else{
      res.json({ code : 200, newProduct })
    }
  }
}))
// // 특정 상품 정보 변경
router.put('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const searchProduct = await Product.findOne({ name : req.body.name });
  if(searchProduct){
    res.status(401).json({ code : 401, message : "중복 상품"})
  }else{
    const product = await Product.findOne({
       _id : req.params.id,
        user : req.user._id });
    if(!product){
      res.status(404).json({ code : 404, message: "Product is not found"});
    }else{
      product.category = req.body.category || product.category;
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.imgUrl = req.body.imgUrl || product.imgUrl;
      product.user = req.body.user ? new ObjectId(req.body.user) : product.user;
      product.lastModifiedAt = Date.now();
      const updateProduct = await product.save();
      if(!updateProduct){
        res.status(401).json({ code : 401, message : "Invalid Product data"});
      }else{
        res.json({ code : 200, updateProduct });
      }
    }
  }
}))
// 특정 상품 삭제
router.delete('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const searchProduct = await Product.findOne({ 
    _id : req.params.id,
    user : req.user._id,
     });
  if(!searchProduct){
    res.status(404).json({ code : 404, messgae : "Product is not found"});
  }else{
    await searchProduct.deleteOne();
    res.status(204).json({ code : 204 , message : "Product is deleted"});
  }
}))

module.exports = router;