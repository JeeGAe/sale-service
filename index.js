const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');
const UsersRoute = require('./src/routes/Users');
const ProductsRoute = require('./src/routes/Products');
const morgan = require('morgan');

mongoose.connect(config.MONGODB_URL)
.then(() => { console.log('MONGODB is conneted successful!')})
.catch(e => console.log(`Failed to connect : ${e}`))



app.use(morgan("dev"));
app.use(express.json());
// 라우트 실행
app.use('/api/users', UsersRoute);
app.use('/api/products', ProductsRoute);

app.get('/', (req, res, next) => {
  res.json({ code : 200 });
})

// 폴백 핸들러
app.use( (req, res, next) => {
  res.status(404).send("Server is not found")
})

app.use( (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error!!");
})
app.listen(3300, () => {
  console.log('Listening ...');
})