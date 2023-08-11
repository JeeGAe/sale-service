const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');
const UsersRoute = require('./src/routes/Users');
const ProductsRoute = require('./src/routes/Products');

mongoose.connect(config.MONGODB_URL)
.then(() => { console.log('MONGODB is conneted successful!')})
.catch(e => console.log(`Failed to connect : ${e}`))

const logger = (req, res, next) => {
  console.log(Date.now())
  next();
}

app.use(logger);
app.use(express.json());
// 라우트 실행
app.use('/api/users', UsersRoute);
app.use('/api/products', ProductsRoute);

app.get('/', (req, res, next) => {
  res.json({ code : 200 });
})


app.listen(3300, () => {
  console.log('Listening ...');
})