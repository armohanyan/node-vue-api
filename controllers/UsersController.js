const User = require("../models/User");

class UserController {

    async findByEmail(email) {
        const user = await User.findOne({ email: email }).select("email").lean();
        if (user) {
            return true
        }
        return false; 
    }
}

module.export = UserController;