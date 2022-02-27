
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const AuthService = require('../services/AuthService');

class AuthenticationController {

    static async signUp(req, res) {
        const data = await AuthService.signUp(req);
        res.status(data.statusCode).json(data);
    }

    static async signIn(req, res) {
        const data  = await AuthService.signIn(req);
        res.status(data.statusCode).json(data);
    }

    static async logout(req, res) {
        const data = await AuthService.logout(); 
        res.status(data.statusCode).json(data);
    }
}

module.exports = AuthenticationController;