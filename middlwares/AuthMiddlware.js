const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req?.cookies?.jwt || req?.headers?.authorization?.split(' ')[1] || null;

  if(token) {
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      res.locals.user = data;
      next();
    } catch(err) {
      res.status(401).send('Unauthorized');
    }
  }
  res.status(401).send('Unauthorized');

};

module.exports = { requireAuth };
