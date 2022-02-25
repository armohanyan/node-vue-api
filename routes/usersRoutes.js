// const express = require('express');
// const mongodb = require('mongodb');
// const User = require('../models/user');
// const route = express.Router();

// route.post('/', async (req, res) => {
//     const { firstName, lastName } = req.body;
//     let user = {};
//     user.firstName = firstName;
//     user.lastName = lastName;
//     let userModel = new User(user);
//     await userModel.save();
//     res.json(userModel);
// });

// module.exports = route;