const { body } = require('express-validator');

const validationMessage = require('../validationMessage');

module.exports = [
  body('title')
    .trim()
    .isLength({ max: 32 })
    .withMessage(validationMessage.max(32)),

  body('body')
    .trim()
    .isLength({ max: 256 })
    .withMessage(validationMessage.max(256)),

];

