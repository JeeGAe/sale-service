const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User = require('../models/User');
const auth = require('../../auth')
const { createToken, isAuth, isAdmin} = auth;

const router = express.Router();

// 회원 가입
router.post('/register', expressAsyncHandler(async (req, res, next) => {
  const user = new User({
    name : req.body.name,
    email : req.body.email,
    userId : req.body.userId,
    password : req.body.password,
  })
  const newUser = await user.save(); 
  if(!newUser){
    res.status(401).json({ code : 401, message : "Invalid User Data"});
  }else{
    const { name, email, userId, isAdmin, createdAt} = newUser;
    res.json({ code : 200, token : createToken(newUser), 
      name, email, userId, isAdmin, createdAt })
  }
}))
// 로그인
router.post('/login', expressAsyncHandler(async (req, res, next) => {
  const user = await User.findOne({ 
    email : req.body.email, 
    password : req.body.password
  })
  if(!user){
    res.status(404).json({ code : 404, message : "Invalid email or password"})
  }else{
    const { name, email, userId, isAdmin} = user;
    res.json({ code : 200, token : createToken(user),
      name, email, userId, isAdmin});
  }
}))
// 로그 아웃
router.post('/logout')
// 유저 정보 수정
router.put('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const searchUser = await User.findOne({
    _id : req.params.id
  })
  if(!searchUser){
    res.status(404).json({ code : 404, message : "Failed to search User"})
  }else{
    searchUser.name = req.body.name || searchUser.name;
    searchUser.email = req.body.email || searchUser.email;
    searchUser.userId = req.body.userId || searchUser.userId;
    searchUser.password = req.body.password || searchUser.password;
    searchUser.isAdmin = req.body.isAdmin ? true : false;
    searchUser.lastModifiedAt = Date.now();
    const updateUser = await searchUser.save();
    if(!updateUser){
      res.status(401).json({ code : 401, message : "Invalid User data"});
    }else{
      const { name, email, userId, isAdmin, lastModifiedAt } = updateUser;
      res.json({ code : 200, token : createToken(updateUser),
        name, email, userId, isAdmin, lastModifiedAt})
    }
  }
  
  
}))
// 유저 삭제
router.delete('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const searchUser = await User.findOne({
    _id : req.params.id,
  })
  if(!searchUser){
    res.status(404).json({ code : 404, message : "Failed to search User"})
  }else{
    await searchUser.deleteOne();
    res.status(204).json({ code : 204, message : "User is deleted"})
  }
}))

module.exports = router;