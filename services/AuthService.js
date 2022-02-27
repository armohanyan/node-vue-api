const { handleErrors} = require("../controllers/errors/handleErrorsController");
const ResponseMessege = require('../common/ResponseMessege');
const { validationResult } = require('express-validator');
const userModel = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const createToken = (id) => {
    return jwt.sign({ id, createdAt: Date.now() }, process.env.JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60,
        algorithm: 'HS256'
    });
}

module.exports = class AuthService {
    constructor() {}

    static async signUp(req) {
        const {
            email,
            password,
            firstName,
            lastName
        } = req.body;
        
        // check is some fields is invalid return response 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const filteredErrors = handleErrors(errors);

            return ResponseMessege({
                message: 'Invalid fields',
                statusCode: 409,
                data: {},
                validationError: filteredErrors
            })
        }
        
        // if there are not invalid fields continue to create
        const user = await userModel.findOne({
            email
        });

        if (user) {
            return ResponseMessege({
                message: 'User already registerd',
                statusCode: 409
            })
        }

        const createUser = await userModel.create({
            firstName,
            lastName,
            password,
            email,
        })
        
        // create jwt token     
        const token = createToken(createUser.id)

        return ResponseMessege({
            message: 'User registered.',
            statusCode: 201,
            data: {
                token
            }
        })
    }

    static async signIn(req) {
        const {
            email,
            password
        } = req.body;

        // check is some fields is invalid return response 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const filteredErrors = handleErrors(errors);

            return ResponseMessege({
                message: 'Invalid fields',
                statusCode: 409,
                data: {},
                validationError: filteredErrors
            })
        }

        // if there are not invalid fields continue to find user
        const user = await userModel.findOne({ email: email }); 

        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            
            if(auth) {
                return ResponseMessege({
                    data: { user }, 
                })
            }
            return ResponseMessege({
                    statusCode: 409,
                    message: "Incorrect password" 
                })
        }
        return ResponseMessege({
            statusCode: 409,
            message: "Incorrect email" 
        })
    }

    static async logout() {
        return ResponseMessege({}); 
    }
}