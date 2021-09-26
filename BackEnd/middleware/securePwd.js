const password = require('../models/securePwd');

module.exports = (req, res, next) => {
    if(password.validate(req.body.password)){
        next()
    } else {
        return res.status(400).json({ message : 'Password is not secure. Please check that your password contains at least : 1uppercase letter - 1lowercase letter - 1digit - no spaces - min lenght 8 : currently ' + password.validate(req.body.password, { list: true }) + ' is/are missing'});
        
    }
}