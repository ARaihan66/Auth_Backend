const express = require("express");
const router = express.Router();
const { userRegister } = require("../Controllers/userController");

router.route("/register").post(userRegister);

module.exports = router;
