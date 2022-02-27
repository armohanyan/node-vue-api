const {
    check
} = require('express-validator');

const validator = {
    validateEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Invalid email'),

    validatePassword: check("password")
        .isLength({
            min: 5
        }).withMessage("Minum characters must be at 5"),
}

module.exports = [
    validator.validateEmail,
    validator.validatePassword
];