// controllers
const AuthenticationController = require('../controllers/AuthenticationController');
const authenticationController = new AuthenticationController();

// validators
const SignInValidation = require('../common/validation/SignInValidation');
const SignUpValidation = require('../common/validation/SignUpValidation');
const ResetPasswordValidation = require('../common/validation/ResetPasswordValidation');

const { Router } = require('express');
const router = Router();

router.post(
  '/sign-up',
  SignUpValidation,
  authenticationController
    .signUp.bind(authenticationController)
);

router.post(
  '/sign-in',
  SignInValidation,
  authenticationController
    .signIn.bind(authenticationController)
);

router.post(
  '/verify-email',
  authenticationController
    .verifyEmail.bind(authenticationController)
);

router.post(
  '/request-verify-email',
  authenticationController
    .requestVerifyEmail.bind(authenticationController)
);

router.post(
  '/resend-token',
  authenticationController
    .resendVerificationToken.bind(authenticationController)
);

router.post(
  '/request-reset-password',
  authenticationController
    .verifyEmailOnResetPassword.bind(authenticationController)
);

router.post(
  '/reset-password',
  ResetPasswordValidation,
  authenticationController
    .resetPassword.bind(authenticationController)
);

module.exports = router;
