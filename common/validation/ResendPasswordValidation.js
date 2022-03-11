const {
  check
} = require('express-validator');

const validationMessage = require('../validationMessage');

const validator = {
  validatePassword: check("password")
    .trim()
    .not()
    .isEmpty().withMessage(validationMessage.required)
    .isLength({ min: 5 }).withMessage(validationMessage.min(5)),
}

module.exports = [
  validator.validatePassword
];
