const AuthService = require('../services/AuthService');
const authService = new AuthService;

class AuthenticationController {

  static async signUp(req, res) {
    const data = await authService.signUp(req);
    res.status(data.statusCode).json(data);
  }

  static async signIn(req, res) {
    const data = await authService.signIn(req);
    res.status(data.statusCode).json(data);
  }

  async verifyEmail(req, res) {
    const data = await authService.verifyEmail(req);
    res.status(data.statusCode).json(data);
  }

  async resendVerificationToken(req, res) {
    const data = await authService.resendVerificationToken(req);
    res.status(data.statusCode).json(data);
  }

}

module.exports = AuthenticationController;
