const  AuthenticationController = require("../controllers/AuthenticationController");
const { Router } = require('express');
const router = Router();


router.post("/sign-up", AuthenticationController.signUp);
router.post("/sign-in", AuthenticationController.signIn);

module.exports = router;
