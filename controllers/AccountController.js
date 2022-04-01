const AccountService = require("../services/AccountService");

class AccountController {
  constructor() {
    this.accountService = new AccountService();
  }

  async current(req, res) {
    const data = await this.accountService.current(req);
    res.status(data.statusCode).json(data);
  }
}

module.exports = AccountController;
