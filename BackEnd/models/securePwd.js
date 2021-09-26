const passwordValidator = require('password-validator');

// Renforcement sécurité du MdP
const passwordModel = new passwordValidator();

passwordModel
.is().min(8)                                    // Minimum lenght 8
.has().uppercase()                              // Must have uppercase letter(s)
.has().lowercase()                              // Must have lowercase letter(s)
.has().digits()                                 // Must have digit(s)
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123', 'Password']); // Banned values

module.exports = passwordModel;