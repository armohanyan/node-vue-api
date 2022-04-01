const AuthService = require('../services/AuthService');
const authService = new AuthService;

class AuthenticationController {

  async signUp(req, res) {
    const data = await authService.signUp(req);
    res.status(data.statusCode).json(data);
  }

  async signIn(req, res) {
    const data = await authService.signIn(req);
    res.status(data.statusCode).json(data);
  }

  async requestVerifyEmail(req, res) {
    const data = await authService.requestVerifyEmail(req);
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

  async verifyEmailOnResetPassword(req, res) {
    const data = await authService.verifyEmailOnResetPassword(req);
    res.status(data.statusCode).json(data);
  }

  async resetPassword(req, res) {
    const data = await authService.resetPassword(req);
    res.status(data.statusCode).json(data);
  }

}

module.exports = AuthenticationController;
