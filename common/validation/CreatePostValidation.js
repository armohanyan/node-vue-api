const { body } = require('express-validator');

const validationMessage = require('../validationMessage');

module.exports = [
  body('title')
    .trim()
    .isLength({ min: 32 })
    .withMessage(validationMessage.min(32)),

  body('body')
    .trim()
    .isLength({ min: 256 })
    .withMessage(validationMessage.min(256)),

  // todo: make validation for image
];
