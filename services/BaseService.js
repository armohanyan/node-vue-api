const { validationResult } = require("express-validator");

module.exports = class BaseService {

  handleErrors(request) {
    const { errors } = validationResult(request);

    if (errors && errors.length) {
      const filteredErrors = {
        property: errors[0].param,
        message: errors[0].msg,
      };

      return {
        hasErrors: true,
        body: {
          success: false,
          statusCode: 400,
          validationError: filteredErrors
        }
      };
    }
    return {
      hasErrors: false,
    };
  }

  response({
    status = true,
    statusCode= 200,
    data = {},
    message =  "",
    validationError = {}
  }) {
    return {
      status,
      statusCode,
      data,
      message,
      validationError
    }
  }

  serverErrorResponse(error) {
    return {
      status: false,
      statusCode: 500,
      data: error,
      message: "Server Error",
      validationError: {}
    }
  }
};
