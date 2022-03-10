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

  static async signUp (req) {
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

    // token for confirmaiton token
    const confirmationToken = jwt.sign({
      email: email
    }, process.env.JWT_EMAIL_SECRET, {
      expiresIn: 60 * 60,
      algorithm: 'HS256'
    })

    // send email verification
    const url = `http://localhost:8080/verify-email/${confirmationToken}`

    // email verification using redis
    // const url = `http://localhost:8080/verify-email/${email}`;
    // await cacheService.setToken(email, confirmationToken);

    mailService.sendMail(email, url)

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
  }

  static async signIn (req) {
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
  }

  async verifyEmail (req) {
    const confirmationToken = req.query.confirmationToken

    const user = await userModel.findOne({
      confirmationToken: confirmationToken
    })

    if (!user) {
      return ResponseMessage({
        message: 'User Not Found',
        statusCode: 404,
        success: false
      })
    }

    await userModel.updateOne({
      _id: user._id,
      isVerified: true
    })

    return ResponseMessage({
      success: true,
      statusCode: 200,
    })
  }

  async resendToken(req) {
    const email = req.query.email

    // token for confirmaiton token
    const confirmationToken = jwt.sign({
      email: email
    }, process.env.JWT_EMAIL_SECRET, {
      expiresIn: 60 * 60,
      algorithm: 'HS256'
    })

    // send email verification
    const url = `http://localhost:8080/verify-email/${confirmationToken}`

    mailService.sendMail(email, url)

    await userModel.updateOne({
      email,
      confirmationToken
    })

    return ResponseMessage({
      message: 'Token was sent to email',
      statusCode: 200
    })
  }

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
}
