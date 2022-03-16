const BaseService = require('./BaseService');
const userModel = require('../models/User');
const { verifyToken } = require('../common/token');

class AccountService extends BaseService {

  constructor() {
    super();
  }

  /**
   * @param req: {
      * cookies.accessToken || headers.authorization
    * }
    * @returns {Promise<{
      * data: Object,
      * success: Boolean,
      * message: String,
      * validationError: Object,
      * statusCode: Number
    * }>}
   */
  async current(req) {

    try {
      const token = req?.cookies?.accessToken || req?.headers?.authorization?.split(' ')[1] || null;
      const isValidToken = verifyToken({ token });

      if(token && isValidToken) {
        const userId = isValidToken.id;

        const user = await userModel.findOne({ _id: userId });

        if(!user) {
          return this.responseMessage({
            statusCode: 400,
            success: false,
            message: "User does not found"
          })
        }

        return this.responseMessage({
          statusCode: 200,
          data: {
            currentAccount: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              isVerified: user.isVerified
            }
          }
        })
      }

      return this.responseMessage({
        statusCode: 401,
        success: false,
        message: "Invalid or expired token"
      })

    } catch(err) {
      return this.responseMessage({
        statusCode: 500,
        success: false,
        data: err
      });
    }
  }
}

module.exports = AccountService;
