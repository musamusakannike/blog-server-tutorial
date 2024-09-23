const {
  userRegistrationController,
  userLoginController,
  banUser,
  unbanUser,
} = require("../controller/user.controller");
const authenticate = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/register", userRegistrationController);
router.post("/login", userLoginController);

// ban users
router.put("/ban/:userId", authenticate, banUser);

// unban users
router.put("/unban/:userId", authenticate, unbanUser);

module.exports = router;
