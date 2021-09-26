const express = require('express');
const router = express.Router();

//checks and security
const userCtrl = require('../controllers/user');
const validEmail = require('../middleware/validEmail');
const securePwd = require('../middleware/securePwd');

//signup
router.post('/signup', validEmail, securePwd, userCtrl.signup);

//login
router.post('/login', userCtrl.login);

module.exports = router;
