const BaseService = require("./BaseService");
const userModel = require("../models/User");
const { verifyToken } = require("../common/token");

class AccountService extends BaseService {
  constructor() {
    super();
  }

  async current(req) {
    try {
      const token =
        req?.cookies?.accessToken ||
        req?.headers?.authorization?.split(" ")[1] ||
        null;

      if (!token) {
        return this.responseBuilder
          .setSuccess(false)
          .setStatus(401)
          .setMessage("Missing data")
          .generateResponse();
      }
      const isValidToken = verifyToken({ token });

      if (isValidToken) {
        const userId = isValidToken.id;

        const user = await userModel.findOne({ _id: userId });

        if (!user) {
          return this.responseBuilder
            .setSuccess(false)
            .setStatus(404)
            .setMessage("User not found")
            .generateResponse();
        }
        return this.responseBuilder.setData({
          currentAccount: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isVerified: user.isVerified,
            role: user.isVerified,
          },
        });
      }

      return this.responseBuilder
        .setSuccess(false)
        .setStatus(401)
        .setMessage("Invalid or expire token")
        .generateResponse();
    } catch (error) {
      return this.responseBuilder
        .setSuccess(false)
        .setStatus(500)
        .setData(error)
        .generateResponse();
    }
  }
}

module.exports = AccountService;
