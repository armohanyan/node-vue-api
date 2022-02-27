const {
    check
} = require('express-validator');

const validator = {
    validateFirstName: check("firstName")
        .isLength({
            min: 3
        }).withMessage("Minum characters must be at 3"),

    validateLastName: check("lastName")
        .isLength({
            min: 3
        }).withMessage("Minum characters must be at 3"),

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
    validator.validateFirstName,
    validator.validateLastName,
    validator.validateEmail,
    validator.validatePassword
];