const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  confirmationToken: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'basic'
  }
});

userSchema.pre('save', async function (next) {
  this.password = bcrypt.hashSync(this.password, 12);
  next();
});

userSchema.pre('updateOne', async function (next) {
  const updatedData = this.getUpdate();
  if (updatedData.password) updatedData.password = bcrypt.hashSync(updatedData.password, 12);
  next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;
