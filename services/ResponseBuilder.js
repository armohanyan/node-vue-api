exports.ResponseBuilder = class ResponseBuilder {
  #statusCode = 200;
  #success = true;
  #data = {};
  #message = '';
  #validationError = {};

  constructor() {}

  setStatus(status) {
    this.#statusCode = status;
    return this;
  }

  setSuccess(success) {
    this.#success = success;
    return this;
  }

  setData(data) {
    this.#data = data;
    return this;
  }

  setMessage(message) {
    this.#message = message;
    return this;
  }

  setValidationError(error) {
    this.#validationError = error;
    return this;
  }

  generateResponse() {
    return {
      statusCode: this.#statusCode,
      success: this.#success,
      data: this.#data,
      message: this.#message,
      validationError: this.#validationError
    };
  }
};
