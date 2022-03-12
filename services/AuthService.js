const userModel = require('../models/User');

// Services
const MailService = require('./mailService');
const bcrypt = require('bcrypt');
const mailService = new MailService();
const BaseService = require('./BaseService');
const { createToken, verifyToken } = require('../common/token');

module.exports = class AuthService extends BaseService {
  constructor() {
    super();
  }

  async signUp(req) {
    try {

      const { email, password, firstName, lastName } = req.body;

      const err = this.handleErrors(req);
      if(err.hasErrors) { return err.body; }

      const user = await userModel.findOne({ email }).exec();

      if(user) {
        return this.responseMessage({
          message: 'User already registered',
          statusCode: 409
        });
      }

      const confirmationToken = createToken(
        { email },
        process.env.JWT_EMAIL_SECRET,
        { expiresIn: 60 * 60 });

      const createUser = await userModel.create({
        confirmationToken,
        firstName,
        lastName,
        password,
        email
      });

      if(createUser) {
        const url = `verify-email?email=${email}&token=${confirmationToken}`;

        mailService.sendMail(
          email,
          url,
          'Email verification',
          'Please click to verify your email'
        );

        const token = createToken({ id: createUser._id });

        return this.responseMessage({
          message: 'User registered.',
          statusCode: 201,
          data: {
            token
          }
        });
      }
    } catch(err) {
      return this.responseMessage({
        message: 'Try again',
        statusCode: 500
      });
    }
  };

  async signIn(req) {
    const { email, password } = req.body;

    const err = this.handleErrors(req);
    if(err.hasErrors) { return err.body; }

    const user = await userModel.findOne({ email }).exec();

    if(user && bcrypt.compareSync(password, user.password)) {
      const token = createToken({ id: user._id });
      return this.responseMessage({
        data: {
          token,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    }

    return this.responseMessage({
      statusCode: 401,
      message: 'Incorrect email and/or password.',
      success: false
    });
  };

  async verifyEmail(req) {
    const { email, token } = req.query;

    if(token && verifyToken(token, process.env.JWT_EMAIL_SECRET)) {

      const user = await userModel.findOne({ email, confirmationToken: token }).exec();

      if(!user) {
        return this.responseMessage({
          message: 'User Not Found',
          statusCode: 404,
          success: false
        });
      }

      await userModel.updateOne({
        _id: user._id,
        isVerified: true,
        confirmationToken: null
      });

      return this.responseMessage({
        success: true,
        statusCode: 200,
        message: 'Email successfully confirmed.'
      });
    } else {
      return this.responseMessage({
        success: false,
        message: 'Invalid or expire token',
        statusCode: 401
      });
    }
  };

  async resendVerificationToken(req) {
    const email = req.query.email;

    const user = await userModel.findOne({ email }).exec();
    if(user) {
      const confirmationToken = createToken(
        { email },
        process.env.JWT_EMAIL_SECRET,
        { expiresIn: 60 * 60 });

      const url = `verify-email?email=${email}&token=${confirmationToken}`;

      await userModel.updateOne({
        email,
        confirmationToken
      });

      mailService.sendMail(
        email,
        url,
        'Email verification',
        'Please click to verify your email'
      );

      return this.responseMessage({
        message: 'Token was sent to email',
        statusCode: 200
      });
    } else {
      return this.responseMessage({
        message: 'User Not Found',
        statusCode: 404,
        success: false
      });
    }
  };

};
