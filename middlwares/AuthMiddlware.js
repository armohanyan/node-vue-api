const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token =
    req?.cookies?.accessToken ||
    req?.headers?.authorization?.split(" ")[1] ||
    null;

  if (token) {
    try {
      res.locals.user = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
      });
      next();
    } catch (err) {
      res.status(401).send("Unauthorized");
    }
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = { requireAuth };
