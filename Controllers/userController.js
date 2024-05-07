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

  //check user exist or not
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

  //create user
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

//login user
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({
      success: false,
      message: "Fill up all the field",
    });
  }

  const existedUser = await userModel.findOne({ email: email });

  if (!existedUser) {
    return res.status(400).json({
      success: false,
      message: "User not found with this email.",
    });
  }

  const isMatchedPassword = await bcrypt.compare(
    password,
    existedUser.password
  );

  if (!isMatchedPassword) {
    return res.status(400).json({
      success: false,
      message: "Password doesn't match.",
    });
  }
  res.status(200).json({
    success: true,
    message: "User login successful",
  });
};

module.exports = { userRegister, userLogin };
