const mongoose = require("mongoose"); 
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String, 
    }, 
    lastName: {
        type: String
    },
    email: {
        type: String,
    },
    password: {
        type: String, 
    }
});
  
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
}); 

const User  = mongoose.model("user", userSchema);

module.exports = User; 