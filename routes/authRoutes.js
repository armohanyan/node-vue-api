// controllers
const AuthenticationController = require('../controllers/AuthenticationController');
const authenticationController = new AuthenticationController();

// validators
const SignInValidation = require('../common/validation/SignInValidation');
const SignUpValidation = require('../common/validation/SignUpValidation');
const ResetPasswordValidation = require('../common/validation/ResetPasswordValidation');

const { Router } = require('express');
const router = Router();

router.post('/sign-up', SignUpValidation, authenticationController.signUp);
router.post('/sign-in', SignInValidation, authenticationController.signIn);
router.get('/verify-email', authenticationController.verifyEmail);
router.get('/resend-token', authenticationController.resendVerificationToken);
router.post("/on-reset-password", authenticationController.verifyEmailOnResetPassword);
router.post("/reset-password", ResetPasswordValidation, authenticationController.resetPassword);

module.exports = router;

