const { body } = require("express-validator");
const validationMessage = require("../validationMessage");

module.exports = [
  body("email").trim().isEmail().withMessage(validationMessage.email),

  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage(validationMessage.min(5)),
];
