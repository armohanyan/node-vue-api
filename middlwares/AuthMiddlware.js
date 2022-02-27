const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).send("Unauthorized")
      } else {
        res.locals.user = decodedToken;
        next();
      }
    })
  } else {
    res.status(401).send("Unauthorized")
  }
}

module.exports = { requireAuth };
