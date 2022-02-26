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
        required: [true, "Please enter an email"], 
        unique: true, 
        lowercase: true,
        validate: [isEmail, "Please use a valid email" ]
    },
    password: {
        type: String, 
        required: [true, "Please enter an password"], 
        minlength: [6, "Minimum password length is 6 characters"]
    }
});
  
// fire a function before doc saved to db 

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
}); 

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });

    if (user) { 
        const auth = await bcrypt.compare(password, user.password);

        if (auth) {
            return user;
        }

        throw Error ("Incorrect password");
    }
    
    throw Error ("Incorrect email"); 
}

const User  = mongoose.model("user", userSchema);

module.exports = User; 