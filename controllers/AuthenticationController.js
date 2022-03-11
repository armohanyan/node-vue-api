const AuthService = require('../services/AuthService')
const authSerive = (new AuthService)

class AuthenticationController {

  static async signUp (req, res) {
    const data = await authSerive.signUp(req)
    res.status(data.statusCode).json(data)
  }

  static async signIn (req, res) {
    const data = await authSerive.signIn(req)
    res.status(data.statusCode).json(data)
  }

  async verifyEmail (req, res) {
    const data = await authSerive.verifyEmail(req)
    res.status(data.statusCode).json(data)
  }

  // verify using Redis
  async verifyEmailByRedis (req, res) {
    const data = await authSerive.verifyEmailByRedis(req)
    res.status(data.statusCode).json(data)
  }

  async resendVerificationToken (req, res) {
    const data = await authSerive.resendVerificationToken(req)
    res.status(data.statusCode).json(data)
  }

  async requestResendPassword (req, res) {
    const data = await authSerive.requestResendPassword(req);
    res.status(data.statusCode).json(data)
  }

  async resendPassword(req, res) {
    const data = await authSerive.resendPassword(req);
    res.status(data.statusCode).json(data);
  }
}

module.exports = AuthenticationController
