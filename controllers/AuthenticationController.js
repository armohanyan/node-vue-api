const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { handleErrors } = require("./errors/handleErrorsController");

class AuthenticationController {

    static async signUp(req, res) {
        const { firstName, lastName, email, password } = req.body;

        const createToken = (id) => {
            return jwt.sign({ id }, "secret secret", {
                expiresIn: 3 * 24 * 60 * 60
            });
        }

        try {
            const user = await User.create({ firstName, lastName, email, password });

            const token = createToken(user._id);
            res.cookie("jwt", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 });

            res.status(200).json({
                success: true,
                data: user._id,
                message: ""
            });
        }
        catch (error) {
            const errors = handleErrors(error);

            res.status(200).json({
                success: false,
                errors: errors,
                message: "something is invalid"
            });
        }
    }

    static async signIn(req, res) {
        const { email, password } = req.body; 
        
        try {
            const user = await User.login(email, password);

            const token = createToken(user._id);
            
            res.cookie("jwt", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 });

            res.status(200).json({
                success: true,  
                user: user._id, 
                message: ""
            })
        } 
        catch (error) {
            console.log(error);
            const errors = handleErrors(error); 
            
            res.status(200).json({
                errors: errors
            });
        }
    }
}

module.exports = AuthenticationController;