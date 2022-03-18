const { body } = require('express-validator');

const validationMessage = require('../validationMessage');

module.exports = [
  body('firstName')
    .trim()
    .not()
    .isEmpty()
    .withMessage(validationMessage.required)
    .isLength({ min: 3 })
    .withMessage(validationMessage.min(3)),

  body('lastName')
    .trim()
    .not()
    .isEmpty()
    .withMessage(validationMessage.required)
    .isLength({ min: 3 })
    .withMessage(validationMessage.min(3)),

  body('email').trim().isEmail().withMessage(validationMessage.email),

  body('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage(validationMessage.required)
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$\n/)
    .withMessage("Min 1 uppercase letter, min 1 lowercase letter, min 1 special character, min 1 number, min 6 characters")

];
