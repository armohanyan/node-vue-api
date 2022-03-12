const userModel = require('../models/User');

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
          statusCode: 201,
          data: {
            token
          },
          message: 'User registered.'
        });
      }
    } catch(err) {
      return this.responseMessage({
        statusCode: 500,
        message: 'Try again'
      });
    }

  };

  async signIn(req) {

    try {
      const { email, password } = req.body;

      const err = this.handleErrors(req);
      if(err.hasErrors) { return err.body; }

      const user = await userModel.findOne({ email }).exec();

      if(user && bcrypt.compareSync(password, user.password)) {
        const token = createToken({ id: user._id });
        return this.responseMessage({
          data: {
            token,
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email
            }
          }
        });
      }

      return this.responseMessage({
        statusCode: 401,
        message: 'Incorrect email and/or password.',
        success: false
      });
    } catch(error) {
      return this.responseMessage({
        statusCode: 500,
        data: error,
        success: false
      });
    }

  };

  async verifyEmail(req) {

    try {
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
    } catch(error) {
      return this.responseMessage({
        statusCode: 500,
        success: false
      });
    }
  };

  async resendVerificationToken(req) {

    try {
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
          statusCode: 404,
          success: false,
          message: 'User Not Found'
        });
      }
    } catch(error) {
      return this.responseMessage({
        statusCode: 500,
        success: false
      });
    }

  };

  async verifyEmailOnResetPassword(req) {

    try {
      const { email } = req.body;

      const user = await userModel.findOne({ email }).exec();

      if(!user) {
        return this.responseMessage({
          statusCode: 404,
          message: 'User Not Found',
          success: false
        });
      }

      const confirmationToken = createToken(
        { email },
        process.env.JWT_EMAIL_SECRET,
        { expiresIn: 60 * 60 });

      const updateUserConfirmationToken = await userModel.updateOne({ email, confirmationToken });

      if(updateUserConfirmationToken) {
        const url = `resend-token?email=${email}&token=${confirmationToken}`;

        mailService.sendMail(
          email,
          url,
          'Reset Password',
          'Please click to reset your password');
      }

      return this.responseMessage({
        message: 'Token was sent to email',
        success: true,
        statusCode: 200
      });

    } catch(error) {
      return this.responseMessage({
        statusCode: 500,
        success: false,
        data: error
      });
    }

  }

  async resetPassword(req) {

    try {
      const { email, password } = req.body;

      // handle validation errors and return if there are
      const validationError = this.handleErrors(req);
      if(validationError.hasErrors) { return validationError.body; }

      const user = await userModel.findOne({ email });

      if(!user) {
        return this.responseMessage({
          statusCode: 404,
          success: false,
          message: 'User Not Found'
        });
      }

      const resetUserPassword = userModel.updateOne({
        email,
        password
      });

      if(resetUserPassword) {
        return this.responseMessage({
          statusCode: 200,
          message: 'Password reset successfully'
        });
      }

    } catch(error) {
      return this.responseMessage({
        statusCode: 500,
        success: false,
        data: {
          error
        }
      });
    }

  }
};
