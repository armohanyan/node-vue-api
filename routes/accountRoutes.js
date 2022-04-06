// controllers
const AccountController = require("../controllers/AccountController");
const accountController = new AccountController();

const { Router } = require("express");
const router = Router();

router.get(
  "/current",
  accountController.current.bind(accountController)
);

module.exports = router;
