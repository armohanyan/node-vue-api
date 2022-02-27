module.exports = ({
  statusCode = 200,
  success = true,
  data = {},
  message = "", 
  validationError = {}
}) => {
  return {
    statusCode: statusCode,
    success: success,
    data: data,
    message: message,
    validationError: validationError
  };
}