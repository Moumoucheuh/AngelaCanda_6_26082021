const express = require('express');
const session = require('express-session');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require('mongoose');
require("dotenv").config();
const path = require('path');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150 // limit each IP to 15 requests per windowMs
});

mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Successful database connection !'))
  .catch(() => console.log('Failed database connection !'));

const app = express();

//Headers settings
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Data sanitization against SQL injections
app.use(mongoSanitize());

//Set various HTTP headers to help to protect an Express application
app.use(helmet());

//httpOnly cookies to avoid a third party changes
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized : true,
  cookie: {
    secure : true,
    httpOnly: true,
    domain: process.env.DOMAIN,
    maxAge : 1000*60*60*24,
  }
}))

//Apply limiter to all requests > limit the number of requests per IP over a given period
app.use(limiter);

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;