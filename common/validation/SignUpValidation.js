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
    .isLength({ min: 5 })
    .withMessage(validationMessage.min(5))
];
