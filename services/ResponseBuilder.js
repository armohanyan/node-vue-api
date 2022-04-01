exports.ResponseBuilder = class ResponseBuilder {
  #statusCode = 200;
  #status = true;
  #data = {};
  #message = '';
  #validationError = {};

  constructor() { }

  setStatus(statusCode) {
    this.#statusCode = statusCode;
    return this;
  }

  setSuccess(status) {
    this.#status = status;
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

  setValidationError(validationError) {
    this.#validationError = validationError;
    return this;
  }

  generateResponse() {
    return {
      statusCode: this.#statusCode,
      status: this.#status,
      data: this.#data,
      message: this.#message,
      validationError: this.#validationError
    };
  }

};
