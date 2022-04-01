const jwt = require("jsonwebtoken");

const token = ({
  payload = {},
  secret = process.env.JWT_SECRET,
  options = {},
}) => {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    ...options,
  });
};

const verifyToken = ({
  token,
  secret = process.env.JWT_SECRET,
  options = {},
}) => {
  try {
    return jwt.verify(token, secret, {
      algorithm: "HS256",
      ...options,
    });
  } catch (err) {
    return false;
  }
};

module.exports = {
  createToken: token,
  verifyToken,
};
