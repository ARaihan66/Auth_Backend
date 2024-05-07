const express = require("express");
const router = express.Router();
const { userRegister, userLogin } = require("../Controllers/userController");
const { authorization } = require("../Authorization/Authorization");

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);

module.exports = router;
