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
    .matches(/^(?=(.*?[A-Z]){3,})(?=(.*[a-z]){3,})(?=(.*[\d]){3,})(?=(.*[\W]){3,})(?!.*\s).{8,}$/)
    .withMessage("Min 3 uppercase letter, min 3 lowercase letter, min 3 special character, min 3 number")

];
