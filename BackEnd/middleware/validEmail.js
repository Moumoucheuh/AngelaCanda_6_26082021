const user = require('../models/user');

const regExpEmail = /^[a-z0-9._-]+@[a-z0-9._-]{2,}[.][a-z]{2,4}$/;

module.exports = (req, res, next) => {
    if(req.body.email.match(regExpEmail)) {
        next()
    } else {
        return res.status(400).json({ message : 'You have entered an invalid email address!' });
    }
}
