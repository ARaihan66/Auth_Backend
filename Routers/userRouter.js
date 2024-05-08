const express = require("express");
const router = express.Router();
const {
  userRegister,
  userLogin,
  userPasswordChange,
  forgotPasswordLinkSendByMail,
  userResetPassword,
  userLogout,
} = require("../Controllers/userController");
const { authorization } = require("../Authorization/Authorization");

//public route
router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/forget-password-link").post(forgotPasswordLinkSendByMail);
router.route("/reset-password/:id/:token").post(userResetPassword);

//protected route
router.route("/password-change").post(authorization, userPasswordChange);
router.route("/logout").get(authorization, userLogout);

module.exports = router;
