const indexRoute = require('./crawler/index');
const express = require('express');
const app = express();

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Cache-Control','no-cache');
  next();
})

app.use('/fetcher',indexRoute);

app.listen(3000, (err) => {
  console.log("Listening");
})