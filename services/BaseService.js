const { validationResult } = require("express-validator");
const { ResponseBuilder } = require("./ResponseBuilder");

module.exports = class BaseService {
  constructor() {
    this.responseBuilder = new ResponseBuilder();
  }

  handleErrors(request) {
    const { errors } = validationResult(request);

    if (errors && errors.length) {
      const filteredErrors = {
        property: errors[0].param,
        message: errors[0].msg,
      };

      return {
        hasErrors: true,
        body: this.responseBuilder
          .setSuccess(false)
          .setStatus(400)
          .setValidationError(filteredErrors)
          .generateResponse(),
      };
    }
    return {
      hasErrors: false,
    };
  }
};
