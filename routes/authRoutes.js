// controllers
const  AuthenticationController = require("../controllers/AuthenticationController");
const authenticationController = new AuthenticationController();

// validators
const SignInValidation = require("../common/validation/SignInValidation");
const SignUpValidation = require("../common/validation/SignUpValidation");
const ResendPasswordValidation = require("../common/validation/ResendPasswordValidation");

const { Router } = require('express');
const router = Router();

router.post("/sign-up", SignUpValidation, AuthenticationController.signUp);
router.post("/sign-in", SignInValidation, AuthenticationController.signIn);
router.get("/verify-email", authenticationController.verifyEmail);
router.get("/resend-token", authenticationController.resendVerificationToken);
router.get("/request-resend-password", authenticationController.requestResendPassword);
router.put("/resend-password", ResendPasswordValidation, authenticationController.resendPassword)

// email verification using redis
// router.get("/verify-email", authenticationController.verifyEmailByRedis);

module.exports = router;
