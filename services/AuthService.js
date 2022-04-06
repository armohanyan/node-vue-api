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
      if(err.hasErrors) {
        return err.body;
      }

      const user = await userModel.findOne({ email }).exec();

      if(user) {
        return this.response({
          status: false,
          statusCode: 409,
          message: 'User already registered'
        });
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
        role: 'basic'
      });

      if(createUser) {
        const url = `verify-email?email=${email}&token=${confirmationToken}`;

        mailService.sendMail(
          email,
          url,
          'Email verification',
          'Please click to verify your email'
        );

        const token = createToken({
          payload: {
            id: createUser._id
          }
        });

        return this.response({
          data: { token },
          statusCode: 201,
          message: 'User Register'
        });
      }
    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async signIn(req) {
    try {
      const err = this.handleErrors(req);
      if(err.hasErrors) {
        return err.body;
      }

      const { email, password } = req.body;

      const user = await userModel.findOne({ email }).exec();

      if(user && bcrypt.compareSync(password, user.password)) {
        if(user.isVerified) {
          const token = createToken({
            payload: {
              id: user._id
            }
          });

          return this.response({
            data: {
              token,
              user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isVerified: user.isVerified,
                role: user.role
              }
            }
          });

        } else {
          return this.response({
            statusCode: 401,
            status: false,
            data: { isVerified: false },
            message: 'Email is not verified'
          });
        }
      }

      return this.response({
        statusCode: 401,
        status: false,
        message: 'Incorrect email and/or  password'
      });

    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async requestVerifyEmail(req) {
    try {
      const { email } = req.body;

      const user = await userModel.findOne({ email }).exec();

      if(!user) {
        return this.response({
          statusCode: 400,
          status: false,
          message: 'Invalid Email'
        });
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
        email,
        confirmationToken
      }).exec();

      const url = `verify-email?email=${email}&token=${confirmationToken}`;

      mailService.sendMail(
        email,
        url,
        'Email verification',
        'Please click to verify your email'
      );

      return this.response({
        message: 'Token was sent to email'
      });

    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async verifyEmail(req) {
    try {
      const { email, token } = req.body;
      if(
        token &&
        verifyToken({ token, secret: process.env.JWT_EMAIL_SECRET })
      ) {
        const isValidUser = await userModel.findOne({ email }).exec();

        if(!isValidUser) {
          return this.response({
            statusCode: 404,
            status: false,
            message: 'User does not  found'
          });
        }

        if(isValidUser.isVerified) {
          return this.response({
            message: 'User has already verified'
          });
        }

        const user = await userModel
          .findOne({
            email,
            confirmationToken: token
          }).exec();

        await userModel.updateOne({
          _id: user._id,
          isVerified: true,
          confirmationToken: null
        }).exec();

        return this.response({
          message: 'Email successfully confirmed'
        });

      } else {
        return this.response({
          status: false,
          statusCode: 401,
          message: 'Invalid or expire token'
        });
      }
    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async resendVerificationToken(req) {
    try {
      const { email } = req.body;

      const user = await userModel.findOne({ email }).exec();

      if(user) {
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
        }).exec();

        mailService.sendMail(
          email,
          url,
          'Email verification',
          'Please click to verify your email'
        );

        return this.response({
          message: 'Invalid or expire token'
        });

      } else {
        return this.response({
          status: false,
          statusCode: 404,
          message: 'User does not found'
        });
      }
    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async verifyEmailOnResetPassword(req) {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email }).exec();

      if(!user) {
        return this.response({
          status: false,
          statusCode: 404,
          message: 'User does not found'
        });
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
      }).exec();

      if(updateUserConfirmationToken) {
        const url = `reset-password?email=${email}&token=${confirmationToken}`;

        mailService.sendMail(
          email,
          url,
          'Reset Password',
          'Please click to reset your password'
        );
      }

      return this.response({
        status: false,
        statusCode: 404,
        message: "Token was sent to email"
      });
    } catch(error) {
      return this.serverErrorResponse(error);
    }
  }

  async resetPassword(req) {
    try {
      const validationError = this.handleErrors(req);
      if(validationError.hasErrors) {
        return validationError.body;
      }

      const { password } = req.body;

      const token = req?.headers?.authorization?.split(' ')[1] || null;
      const isTokenValid = verifyToken({
        token,
        secret: process.env.JWT_PASSOWRD_RESET_SECRET
      });

      if(isTokenValid) {
        const { email } = isTokenValid;
        const user = await userModel.findOne({ email }).exec();

        if(!user) {
          return this.response({
            status: false,
            statusCode: 404,
            message: "User does not found"
          });
        }

        const resetUserPassword = await userModel.updateOne({
          email,
          password,
          confirmationToken: null
        }).exec();

        if(resetUserPassword) {
          return this.response({
            status: false,
            statusCode: 404,
            message: "Password reset successfully"
          });
        }
      } else {
        return this.response({
          status: false,
          statusCode: 401,
          message: "Invalid token"
        });
      }
    } catch(error) {
      return this.serverErrorResponse(error)
    }
  }
};
