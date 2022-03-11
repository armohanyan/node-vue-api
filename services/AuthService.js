const handleErrors = require('../controllers/errors/handleErrorsController')
const ResponseMessage = require('../common/ResponseMessage')
const { validationResult } = require('express-validator')
const userModel = require('../models/User')
const jwt = require('jsonwebtoken')

// Services
const MailService = require('./mailService')
const CacheService = require('../services/CacheService')
const bcrypt = require('bcrypt')
const cacheService = CacheService
const mailService = new MailService()

const createToken = (id) => {

  return jwt.sign({
    id,
    createdAt: Date.now()
  }, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
    algorithm: 'HS256'
  })
}

module.exports = class AuthService {
  constructor () {}

  sendMail ({ email, subject, purpose }) {
    // token for confirmaiton token
    const confirmationToken = jwt.sign({
      email: email
    }, process.env.JWT_EMAIL_SECRET, {
      expiresIn: 60 * 60,
      algorithm: 'HS256'
    })

    // send email verification
    const url = `${process.env.SITE_URL}/verify-email/${email}/${confirmationToken}`
    mailService.sendMail(email, url, subject, purpose)

    return confirmationToken
  }

  async signUp (req) {
    const {
      email,
      password,
      firstName,
      lastName
    } = req.body

    // check is some fields is invalid return response
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const filteredErrors = handleErrors(errors)

      return ResponseMessage({
        statusCode: 400,
        validationError: filteredErrors
      })
    }

    // if there are not invalid fields continue to create
    const user = await userModel.findOne({
      email
    })

    if (user) {
      return ResponseMessage({
        message: 'User already registered',
        statusCode: 409
      })
    }

    const confirmationToken = this.sendMail({
      email: email,
      subject: 'Email verification',
      purpose: 'Please click to verify your email'
    })

    const createUser = await userModel.create({
      confirmationToken,
      firstName,
      lastName,
      password,
      email
    })

    // create jwt token
    const token = createToken(createUser.id)

    return ResponseMessage({
      message: 'User registered.',
      statusCode: 201,
      data: {
        token
      }
    })
  };

  async signIn (req) {
    const {
      email,
      password
    } = req.body

    // check is some fields is invalid return response
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const filteredErrors = handleErrors(errors)

      return ResponseMessage({
        statusCode: 400,
        validationError: filteredErrors
      })
    }
    // if there are not invalid fields continue to find user
    const user = await userModel.findOne({
      email
    })

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = createToken(user._id)
      return ResponseMessage({
        data: {
          token,
          user
        }
      })
    }

    return ResponseMessage({
      statusCode: 401,
      message: 'Incorrect email and/or password.',
      success: false
    })
  };

  async verifyEmail (req) {
    const { email, confirmationToken } = req.query

    const user = await userModel.findOne({
      email,
      confirmationToken
    })

    if (!user) {
      return ResponseMessage({
        message: 'User Not Found',
        statusCode: 404,
        success: false
      })
    }
    // todo: continue to work with jwt.verify
    // jwt.verify(confirmationToken, process.env.JWT_EMAIL_SECRET, (err, decoded) => {
    //   console.log(err, decoded)
    // });

    await userModel.updateOne({
      _id: user._id,
      isVerified: true
    })

    return ResponseMessage({
      success: true,
      statusCode: 200,
    })
  };

  //verify email using REDIS
  async verifyEmailByRedis (req) {
    const { email, confirmationToken } = req.query

    const user = await userModel.findOne({
      email
    })

    if (!user) {
      return ResponseMessage({
        message: 'User Not Found',
        statusCode: 404,
        success: false
      })
    }

    if (user.isVerified) {
      return ResponseMessage({
        message: 'User have already verified',
        statusCode: 201
      })
    }

    const response = await cacheService.getToken(email)

    if (!response === confirmationToken) {
      return ResponseMessage({
        message: 'Invalid or expired token',
        statusCode: 401,
        success: false
      })
    }

    await userModel.updateOne({
      email: email,
      isVerified: true
    })

    return ResponseMessage({
      success: true,
      statusCode: 201,
    })
  };

  async resendVerificationToken (req) {
    const email = req.query.email

    const confirmationToken = this.sendMail({
       email,
      subject: 'Email verification',
      purpose: 'Please click to verify your email'
    })

    await userModel.updateOne({
      email,
      confirmationToken
    })

    return ResponseMessage({
      message: 'Token was sent to email',
      statusCode: 200
    })
  };

  async requestResendPassword (req) {
    const email = req.query.email

    const user = await userModel.findOne({ email })

    if (!user) {
      return ResponseMessage({
        statusCode: 401,
        message: 'Incorrect email',
        success: false
      })
    }

    const confirmationToken = this.sendMail({
      email,
      subject: 'Resend Password',
      purpose: 'Please click to resend password'
    })

    await userModel.updateOne({
      email,
      confirmationToken
    })

    return ResponseMessage({
      statusCode: 200,
      message: 'Token was send to email'
    })
  }

  async resendPassword (req) {
    const { email, password } = req.body

    const user = await userModel.findOne({
      email
    })

    if (!user) {
      return ResponseMessage({
        message: 'User Not Found',
        statusCode: 404,
        success: false
      })
    }

    // check is some fields is invalid return response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const filteredErrors = handleErrors(errors)

      return ResponseMessage({
        statusCode: 400,
        validationError: filteredErrors
      })
    }

    await userModel.updateOne({
      email,
      password
    });

    return ResponseMessage({
      statusCode: 204, // todo: review status code
      message: "Password reset successfully"
    })
  }
}
