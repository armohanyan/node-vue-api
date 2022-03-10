const AuthService = require('../services/AuthService');
const authSerive = (new AuthService);

class AuthenticationController {

    static async signUp(req, res) {
        const data = await AuthService.signUp(req);
        res.status(data.statusCode).json(data);
    }

    static async signIn(req, res) {
        const data  = await AuthService.signIn(req);
        res.status(data.statusCode).json(data);
    }

    async verifyEmail(req, res) {
        const data = await authSerive.verifyEmail(req);
        res.status(data.statusCode).json(data);
    }
    // verify using Redis
    async verifyEmailByRedis(req, res) {
        const data = await authSerive.verifyEmailByRedis(req);
        res.status(data.statusCode).json(data);
    }

    async resendToken(req, res) {
        const data = await authSerive.resendToken(req);
        res.status(data.statusCode).json(data);
    }
}

module.exports = AuthenticationController;
