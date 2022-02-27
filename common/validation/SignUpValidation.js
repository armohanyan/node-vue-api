const {
  check
} = require('express-validator');

const validationMessage = require('../validationMessage');

const validator = {
  validateFirstName: check("firstName")
    .trim()
    .not()
    .isEmpty().withMessage(validationMessage.required)
    .isLength({ min: 3 }).withMessage(validationMessage.min(3)),

  validateLastName: check("lastName")
    .trim()
    .not()
    .isEmpty().withMessage(validationMessage.required)
    .isLength({ min: 3 }).withMessage(validationMessage.min(3)),

  validateEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage(validationMessage.email),

  validatePassword: check("password")
    .trim()
    .not()
    .isEmpty().withMessage(validationMessage.required)
    .isLength({ min: 5 }).withMessage(validationMessage.min(5)),
}

module.exports = [
  validator.validateFirstName,
  validator.validateLastName,
  validator.validateEmail,
  validator.validatePassword
];
