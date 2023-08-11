const jwt = require('jsonwebtoken');
const config = require('./config');

const createToken = (user) => {
  return jwt.sign({
    _id : user._id,
    name : user.name,
    email : user.email,
    userId : user.userId,
    password : user.password,
    isAdmin : user.isAdmin,
    createdAt : user.createdAt,
    lastModified : user.lastModified,
  },
  config.JWT_SECRET,
  {
    expiresIn : '1d',
    issuer : 'JeeGAe',
  })
}

const isAuth = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if(!bearerToken){
    res.status(401).json({ code : 401, message : 'Token is not supplied'});
  }else{
    const token = bearerToken.slice(7, bearerToken.length);
    jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
      if(err && err.name === 'TokenExporedError'){
        res.status(419).json({ code : 149, message : "Token is expired"});
      }else if(err){
        res.status(401).json({ code : 401, message: 'Invalid Token'})
      }else{
        req.user = userInfo;
        next();
      }
    })
  }
}

const isAdmin = (req, res, next) => {
  if(req.user && req.user.isAdmin){
    next();
  }else{
    res.status(401).json({ code : 401, message : 'You are not Admin'});
  }
}

module.exports = {
  createToken,
  isAuth,
  isAdmin,
}