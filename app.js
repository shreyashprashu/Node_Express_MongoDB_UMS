const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const { createProxyMiddleware } = require('http-proxy-middleware');
const productRoutes = require("./api/routes/product");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require('./api/routes/users');
const cors = require('cors');
//const path= require('path');

//const port = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://dbUser:'+ process.env.MONGO_ATLAS_PW +'@cluster0.qyd8r.mongodb.net/test',{ useUnifiedTopology: true ,useNewUrlParser: true,useCreateIndex: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
//app.use(express.static(path.join('uploads', 'public')));
app.use('./uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(
//   "/products",
//   createProxyMiddleware({
//     target: "http://192.168.0.177:5000",
//     changeOrigin: true
//   })
// );
//app.use('/products', createProxyMiddleware({ target: 'http://192.168.0.177:3000', changeOrigin: true }));
 
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
 // res.header('Access-Control-Allow-Origin','*');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
app.use(cors({ origin: true }));

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

//app.listen(port);
module.exports = app;
