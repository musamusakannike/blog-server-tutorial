const { userRegistrationController, userLoginController } = require('../controller/user.controller');

const router = require('express').Router();

router.post("/register", userRegistrationController);
router.post("/login", userLoginController);

module.exports = router;