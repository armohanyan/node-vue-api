// controllers
const AuthenticationController = require('../controllers/AuthenticationController');
const authenticationController = new AuthenticationController();

// validators
const SignInValidation = require('../common/validation/SignInValidation');
const SignUpValidation = require('../common/validation/SignUpValidation');

const { Router } = require('express');
const router = Router();

router.post('/sign-up', SignUpValidation, AuthenticationController.signUp);
router.post('/sign-in', SignInValidation, AuthenticationController.signIn);
router.get('/verify-email', authenticationController.verifyEmail);
router.get('/resend-token', authenticationController.resendVerificationToken);

module.exports = router;
