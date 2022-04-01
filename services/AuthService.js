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
      if (err.hasErrors) {
        return err.body;
      }

      const user = await userModel.findOne({ email }).exec();

      if (user) {
        return this.responseBuilder
          .setMessage('User already registered')
          .setSuccess(false)
          .setStatus(409)
          .generateResponse();
      }

      const confirmationToken = createToken({
        payload: {
          email
        },
        secret: process.env.JWT_EMAIL_SECRET,
        options: {
          expiresIn: '2m'
        }
      });

      const createUser = await userModel.create({
        confirmationToken,
        firstName,
        lastName,
        password,
        email,
        role: "basic"
      });

      if (createUser) {
        const url = `verify-email?email=${email}&token=${confirmationToken}`;

        mailService.sendMail(email, url, 'Email verification', 'Please click to verify your email');

        const token = createToken({
          payload: {
            id: createUser._id
          }
        });

        return this.responseBuilder
          .setMessage('User registered')
          .setStatus(201)
          .setData({ token })
          .generateResponse();

      }
    } catch (err) {
      return this.responseBuilder
        .setSuccess(false)
        .setStatus(500)
        .generateResponse();
    }
  };

  async signIn(req) {
    try {
      const err = this.handleErrors(req);
      if (err.hasErrors) {
        return err.body;
      }

      const { email, password } = req.body;

      const user = await userModel.findOne({ email }).exec();

      if (user && bcrypt.compareSync(password, user.password)) {

        if (user.isVerified) {
          const token = createToken({
            payload: {
              id: user._id
            }
          });

          return this.responseBuilder
            .setData({
              token,
              user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isVerified: user.isVerified,
                role: user.role
              }
            }).generateResponse();

        } else {
          return this.responseBuilder
            .setData({ isVerified: false })
            .setStatus(401)
            .setMessage('Email is not verified')
            .setSuccess(false)
            .generateResponse();
        }
      }

      return this.responseBuilder
        .setStatus(401)
        .setMessage('Incorrect email and/or  password')
        .setSuccess(false)
        .generateResponse();

    } catch (error) {
      return this.responseBuilder
        .setData(error)
        .setStatus(500)
        .setSuccess(false)
        .generateResponse();
    }

  };

  async requestVerifyEmail(req) {
    try {
      const { email } = req.body;

      const user = await userModel.findOne({ email }).exec();

      if (!user) {
        return this.responseBuilder
          .setStatus(400)
          .setMessage('Invalid Email')
          .setSuccess(false)
          .generateResponse();
      }

      const confirmationToken = createToken({
        payload: {
          email
        },
        secret: process.env.JWT_EMAIL_SECRET,
        options: {
          expiresIn: '2m'
        }
      });

      await userModel.updateOne({
        email, confirmationToken
      });

      const url = `verify-email?email=${email}&token=${confirmationToken}`;

      mailService.sendMail(email, url, 'Email verification', 'Please click to verify your email');

      return this.responseBuilder
        .setMessage('Token was sent to email')
        .generateResponse();

    } catch (error) {
      return this.responseBuilder
        .setData(error)
        .setStatus(500)
        .setSuccess(false)
        .generateResponse();
    }
  };

  async verifyEmail(req) {
    try {
      const { email, token } = req.body;
      if (token && verifyToken({ token, secret: process.env.JWT_EMAIL_SECRET })) {

        const isValidUser = await userModel.findOne({ email }).exec();

        if (!isValidUser) {
          return this.responseBuilder
            .setStatus(404)
            .setMessage('User does not found')
            .setSuccess(false)
            .generateResponse();
        }

        if (isValidUser.isVerified) {
          return this.responseBuilder
            .setMessage('User has already verified')
            .generateResponse();
        }

        const user = await userModel.findOne({
          email,
          confirmationToken: token
        }).exec();

        await userModel.updateOne({
          _id: user._id,
          isVerified: true,
          confirmationToken: null
        });

        return this.responseBuilder
          .setMessage('Email successfully confirmed')
          .generateResponse();

      } else {
        return this.responseBuilder
          .setStatus(401)
          .setMessage('Invalid or expire token')
          .setSuccess(false)
          .generateResponse();
      }
    } catch (error) {
      return this.responseBuilder
        .setData(error)
        .setStatus(500)
        .setSuccess(false)
        .generateResponse();
    }
  };

  async resendVerificationToken(req) {
    try {
      const { email } = req.body;

      const user = await userModel.findOne({ email }).exec();

      if (user) {
        const confirmationToken = createToken({
          payload: {
            email
          },
          secret: process.env.JWT_EMAIL_SECRET,
          options: {
            expiresIn: '2m'
          }
        });

        const url = `verify-email?email=${email}&token=${confirmationToken}`;

        await userModel.updateOne({
          email,
          confirmationToken
        });

        mailService.sendMail(email, url, 'Email verification', 'Please click to verify your email');

        return this.responseBuilder
          .setMessage('Token was sent to email')
          .generateResponse();

      } else {
        return this.responseBuilder
          .setStatus(404)
          .setMessage('User does not found')
          .setSuccess(false)
          .generateResponse();
      }

    } catch (error) {
      return this.responseBuilder
        .setData(error)
        .setStatus(500)
        .setSuccess(false)
        .generateResponse();
    }

  };

  async verifyEmailOnResetPassword(req) {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email }).exec();

      if (!user) {
        return this.responseBuilder
          .setStatus(404)
          .setMessage('User does not found')
          .setSuccess(false)
          .generateResponse();
      }

      const confirmationToken = createToken({
        payload: {
          email
        },
        secret: process.env.JWT_PASSOWRD_RESET_SECRET,
        options: {
          expiresIn: '10m'
        }
      });

      const updateUserConfirmationToken = await userModel.updateOne({
        email,
        confirmationToken
      });

      if (updateUserConfirmationToken) {
        const url = `reset-password?email=${email}&token=${confirmationToken}`;

        mailService.sendMail(email, url, 'Reset Password', 'Please click to reset your password');
      }

      return this.responseBuilder
        .setMessage('Token was sent to email')
        .generateResponse();

    } catch (error) {
      return this.responseBuilder
        .setData(error)
        .setStatus(500)
        .setSuccess(false)
        .generateResponse();
    }

  }

  async resetPassword(req) {
    try {
      const validationError = this.handleErrors(req);
      if (validationError.hasErrors) {
        return validationError.body;
      }

      const { password } = req.body;

      const token = req?.headers?.authorization?.split(' ')[1] || null;
      const isTokenValid = verifyToken({
        token,
        secret: process.env.JWT_PASSOWRD_RESET_SECRET
      });

      if (isTokenValid) {
        const { email } = isTokenValid;
        const user = await userModel.findOne({ email });

        if (!user) {
          return this.responseBuilder
            .setStatus(404)
            .setMessage('User does not found')
            .setSuccess(false)
            .generateResponse();
        }

        const resetUserPassword = await userModel.updateOne({
          email, password, confirmationToken: null
        });

        if (resetUserPassword) {
          return this.responseBuilder
            .setMessage('Password reset successfully')
            .generateResponse();

        }
      } else {
        return this.responseBuilder
          .setStatus(401)
          .setMessage('Invalid token')
          .setSuccess(false)
          .generateResponse();

      }

    } catch (error) {
      return this.responseBuilder
        .setStatus(500)
        .setSuccess(false)
        .generateResponse();
    }
  };
};

