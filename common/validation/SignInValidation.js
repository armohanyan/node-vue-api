const {
  check
} = require('express-validator');
const validationMessage = require("../validationMessage");

const validator = {
  validateEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage(validationMessage.email),

  validatePassword: check("password")
    .trim()
    .isLength({ min: 5 }).withMessage(validationMessage.min(5)),
}

module.exports = [
  validator.validateEmail,
  validator.validatePassword
];
