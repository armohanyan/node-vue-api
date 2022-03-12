const { validationResult } = require('express-validator');

module.exports = class BaseService {
  constructor() {}

  responseMessage({
    statusCode = 200,
    success = true,
    data = {},
    message = '',
    validationError = {},
  }) {
    return {
      statusCode,
      success,
      data,
      message,
      validationError,
    };
  }

  handleErrors(request) {
    const { errors } = validationResult(request);

    if(errors && errors.length) {
      const filteredErrors = {
        property: errors[0].param,
        message: errors[0].msg,
      };

      return {
        hasErrors: true,
        body: this.responseMessage({
          statusCode: 400,
          validationError: filteredErrors,
        }),
      };
    }
    return {
      hasErrors: false,
    };

  }
};
