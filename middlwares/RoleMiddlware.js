const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

const requireAdmin = async(req, res, next) => {
  const token = req?.cookies?.accessToken || req?.headers?.authorization?.split(' ')[1] || null;

  if(token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

      const user = await userModel.find({ id: payload.id });

     if(user.role !== "admin") {
       res.status(401).send("Unauthorized")
     }

      next();
    } catch(err) {
      res.status(401).send('Unauthorized');
    }
  } else {
    res.status(401).send('Unauthorized');
  }

};

module.exports = { requireAdmin };

