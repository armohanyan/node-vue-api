const AuthService = require("../services/AuthService");

class AuthenticationController {

  constructor() {
    this.authService = new AuthService()
  }

  async signUp(req, res) {
    const data = await this.authService.signUp(req);
    res.status(data.statusCode).json(data);
  }

  async signIn(req, res) {
    const data = await this.authService.signIn(req);
    res.status(data.statusCode).json(data);
  }

  async requestVerifyEmail(req, res) {
    const data = await this.authService.requestVerifyEmail(req);
    res.status(data.statusCode).json(data);
  }

  async verifyEmail(req, res) {
    const data = await this.authService.verifyEmail(req);
    res.status(data.statusCode).json(data);
  }

  async resendVerificationToken(req, res) {
    const data = await this.authService.resendVerificationToken(req);
    res.status(data.statusCode).json(data);
  }

  async verifyEmailOnResetPassword(req, res) {
    const data = await this.authService.verifyEmailOnResetPassword(req);
    res.status(data.statusCode).json(data);
  }

  async resetPassword(req, res) {
    const data = await this.authService.resetPassword(req);
    res.status(data.statusCode).json(data);
  }
}

module.exports = AuthenticationController;
