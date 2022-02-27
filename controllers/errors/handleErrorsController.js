function handleErrors({ errors }) {
    const error = errors[0];
    return {
      property: error.param,
      message: error.msg
    }
}

module.exports = handleErrors;
