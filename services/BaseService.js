const { validationResult } = require('express-validator');

module.exports = class BaseService {

  constructor() {  }

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
          success: false,
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
