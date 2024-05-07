const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");

//register user
const userRegister = async (req, res) => {
  const { name, email, password, confirmPassword, tc } = req.body;

  if (!name && !email && !password && !confirmPassword) {
    return res.status(400).json({
      success: true,
      message: "Please fill up all the field.",
    });
  }

  const existUser = await userModel.findOne({ email: email });

  if (existUser) {
    return res.status(400).json({
      success: false,
      message: "This email is already registered.",
    });
  }

  if (password !== confirmPassword) {
   return res.status(400).json({
      success: false,
      message: "Password and confirm password doesn't match",
    });
  }

  //hashing password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const saveUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
    tc,
  });

  res.status(200).json({
    success: true,
    message: "Successfully registered",
    data: saveUser,
  });
};

module.exports = { userRegister };
