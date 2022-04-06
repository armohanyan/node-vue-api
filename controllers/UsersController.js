const User = require("../models/User");

class UserController {
  async findByEmail(email) {
    const user = await User.findOne({ email: email }).select("email").lean();
    return !!user;
  }
}

module.export = UserController;
