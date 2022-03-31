const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

const roles = {
  ADMIN: 'admin',
  BASIC: "basic",
  SUPERADMIN: 'superAdmin'
};

const roleAuth = (role = 'basic') => {
  return (req, res, next) => {

    const token = req?.cookies?.accessToken || req?.headers?.authorization?.split(' ')[1] || null;

    if(token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

        userModel.findOne({ _id: payload.id }).exec((err, user) => {

          if(err) {
            return res.status(500).send('Server error');
          }

          if(user.role === roles.SUPERADMIN) {
            return next()
          }

          if(user.role !== role) {
            return res.status(401).send('Unauthorized');
          }

          next();
        });
      } catch(err) {
        res.status(401).send('Unauthorized');
      }
    } else {
      res.status(401).send('Unauthorized');
    }
  };

};

module.exports = { roleAuth };

