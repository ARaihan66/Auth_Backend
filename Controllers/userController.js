const userModel = require("../Models/userModel");

//register user
const userLogin = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword0) {
    return res.status(400).json({
      success: true,
      message: "Please fill up all the field.",
    });
  }

  const saveUser = await userModel.create({
    name,
    email,
    password,
    confirmPassword,
  });

  res.status(200).json({
    success: true,
    message: "Successfully registered",
    data: saveUser,
  });
};
