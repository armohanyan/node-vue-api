const User = require("../models/User");
const { handleErrors } = require("./errors/handleErrorsController");

class AuthenticationController {

    // sign-up
    static async signUp(data){
        const { email, password } = data;

        try {
            const user = await User.create({ email, password });
            return {
                success: true,
                data: user,
                message: ""
            };
        } 
        catch (error) {
            const errors = handleErrors(error); 
            return {
                success: false,
                data: errors,
                message: "something is invalid"
            }
        }
    }   
}

module.exports = AuthenticationController;