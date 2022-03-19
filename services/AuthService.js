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

  /**
   * @param req: {
   * email,
   * password,
   * firstName,
   * lastName
   * }
   * @returns {Promise<{
   * data: Object,
   * success: Boolean,
   * message: String,
   * validationError: Object,
   * statusCode: Number
   * }>}
   */
  async signUp(req) {
    try {
      const { email, password, firstName, lastName } = req.body;

      const err = this.handleErrors(req);
      if(err.hasErrors) { return err.body; }

      const user = await userModel.findOne({ email }).exec();

      if(user) {
        return this.responseMessage({
          message: 'User already registered',
          success: false,
          statusCode: 409
        });
      }

      const confirmationToken = createToken({
        payload: { email },
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
        email
      });

      if(createUser) {
        const url = `verify-email?email=${email}&token=${confirmationToken}`;

        mailService.sendMail(email, url, 'Email verification', 'Please click to verify your email');

        const token = createToken({
          payload: {
            id: createUser._id
          }
        });

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
        success: false,
        message: 'Try again'
      });
    }

  };

  /**
   * @param req: {
   * email
   * password
   * }
   * @returns {Promise<{
   * data: Object,
   * success: Boolean,
   * message: String,
   * validationError: Object,
   * statusCode: Number
   * }>}
   */
  async signIn(req) {
    try {
      const err = this.handleErrors(req);
      if(err.hasErrors) { return err.body; }

      const { email, password } = req.body;

      const user = await userModel.findOne({ email }).exec();

      if(user && bcrypt.compareSync(password, user.password)) {

        if(user.isVerified) {
          const token = createToken({
            payload: {
              id: user._id
            }
          });

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
        } else {
          return this.responseMessage({
            statusCode: 401,
            message: 'Email is not verified',
            success: false,
            data: {
              isVerified: false
            }
          });
        }
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

  /**
   * @param req: {
      * email
   * }
   * @returns {Promise<{
     * data: Object,
     * success: Boolean,
     * message: String,
     * validationError: Object,
     * statusCode: Number
   * }>}
   */
  async requestVerifyEmail(req) {
    try {
      const { email } = req.body;

      const user = await userModel.findOne({ email }).exec();;

      if(!user) {
        return this.responseMessage({
          statusCode: 400,
          success: false,
          message: 'Invalid email'
        });
      }

      const confirmationToken = createToken({
        payload: { email },
        secret: process.env.JWT_EMAIL_SECRET,
        options: {
          expiresIn: '2m'
        }
      });

      await userModel.updateOne({
        email,
        confirmationToken
      })

      const url = `verify-email?email=${email}&token=${confirmationToken}`;

      mailService.sendMail(
        email,
        url,
        'Email verification',
        'Please click to verify your email'
      );

      return this.responseMessage({
        statusCode: 200,
        message: "Token was sent to email"
      })

    } catch(error) {
      return this.responseMessage({
        statusCode: 500,
        success: false,
        data: {
          error
        }
      })
    }
  }

  /**
   * @param req: {
   * email
   * token
   * }
   * @returns {Promise<{
   * data: Object,
   * success: Boolean,
   * message: String,
   * validationError: Object,
   * statusCode: Number
   * }>}
   */
  async verifyEmail(req) {
    try {
      const { email, token } = req.body;
      if(token && verifyToken({ token, secret: process.env.JWT_EMAIL_SECRET })) {

        const isValidUser = await userModel.findOne({ email }).exec();

        if(!isValidUser) {
          return this.responseMessage({
            message: 'User does not found',
            statusCode: 404,
            success: false
          });
        }

        if(isValidUser.isVerified) {
          return this.responseMessage({
            statusCode: 200,
            message: 'User has already verified'
          });
        }

        const user = await userModel.findOne({ email, confirmationToken: token }).exec();

        await userModel.updateOne({
          _id: user._id,
          isVerified: true,
          confirmationToken: null
        });

        return this.responseMessage({
          success: true,
          statusCode: 200,
          message: 'Email successfully confirmed'
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
        success: false,
        data: error
      });
    }
  };

  /**
   * @param req: {
   * email
   * }
   * @returns {Promise<{
   * data: Object,
   * success: Boolean,
   * message: String,
   * validationError: Object,
   * statusCode: Number
   * }>}
   */
  async resendVerificationToken(req) {
    try {
      const { email } = req.body;

      const user = await userModel.findOne({ email }).exec();

      if(user) {
        const confirmationToken = createToken({
          payload: { email },
          secret: process.env.JWT_EMAIL_SECRET,
          options: { expiresIn: '2m' }
        });

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
          message: 'User does not found'
        });
      }
    } catch(error) {
      return this.responseMessage({
        statusCode: 500,
        success: false,
        data: error
      });
    }

  };

  /**
   * @param req: {
   * email
   * }
   * @returns {Promise<{
   * data: Object,
   * success: Boolean,
   * message: String,
   * validationError: Object,
   * statusCode: Number
   * }>}
   */
  async verifyEmailOnResetPassword(req) {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email }).exec();

      if(!user) {
        return this.responseMessage({
          statusCode: 404,
          message: 'User does not found',
          success: false
        });
      }

      const confirmationToken = createToken({
        payload: { email },
        secret: process.env.JWT_PASSOWRD_RESET_SECRET,
        options: { expiresIn: '10m' }
      });

      const updateUserConfirmationToken = await userModel.updateOne({ email, confirmationToken });

      if(updateUserConfirmationToken) {
        const url = `reset-password?email=${email}&token=${confirmationToken}`;

        mailService.sendMail(
          email,
          url,
          'Reset Password',
          'Please click to reset your password'
        );
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

  /**
   * @param req: {
   * password
   * }
   * @returns {Promise<{
   * data: Object,
   * success: Boolean,
   * message: String,
   * validationError: Object,
   * statusCode: Number
   * }>}
   */
  async resetPassword(req) {
    try {
      const validationError = this.handleErrors(req);
      if(validationError.hasErrors) { return validationError.body; }

      const { password } = req.body;

      const token = req?.headers?.authorization?.split(' ')[1] || null;
      const isTokenValid = verifyToken({
        token,
        secret: process.env.JWT_PASSOWRD_RESET_SECRET
      });

      if(isTokenValid) {
        const { email } = isTokenValid;
        const user = await userModel.findOne({ email });

        if(!user) {
          return this.responseMessage({
            statusCode: 404,
            success: false,
            message: 'User does not found'
          });
        }

        const resetUserPassword = await userModel.updateOne({
          email,
          password,
          confirmationToken: null
        });

        if(resetUserPassword) {
          return this.responseMessage({
            statusCode: 200,
            message: 'Password reset successfully'
          });
        }
      } else {
        return this.responseMessage({
          statusCode: 401,
          success: false,
          message: 'Invalid token'
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
  };
};

