const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SendMail } = require("../Utils/SendMail");

// User registration
const userRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, tc } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // Check if the email is already registered
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    // Check if password matches confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      tc,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again later.",
    });
  }
};

// User login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // Find user by email
    const user = await userModel.findOne({ email });

    // Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });

    // Set JWT token in HTTP-only cookie
    res
      .cookie("Token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful.",
        token,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again later.",
    });
  }
};

// User password change
const userPasswordChange = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const userId = req.id;

    // Check if password and confirmPassword are provided
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide new password and confirm password.",
      });
    }

    // Check if new password matches confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Password change failed. Please try again later.",
    });
  }
};

// Send reset password link by email
const forgotPasswordLinkSendByMail = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email address.",
      });
    }

    // Find user by email
    const user = await userModel.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email address.",
      });
    }

    // Generate reset password token
    const secretKey = user._id + process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "15m",
    });

    // Compose reset password link
    const resetLink = `https://localhost:3000/reset-password/${user._id}/${token}`;

    // Send reset password link by email
    SendMail(email, "Reset Password", resetLink);

    res.status(200).json({
      success: true,
      message: "Reset password link sent successfully.",
      link: resetLink,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send reset password link. Please try again later.",
    });
  }
};

// Reset user password
const userResetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const { id, token } = req.params;
    console.log(id);
    console.log(token);

    // Find user by ID
    const user = await userModel.findById(id);

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. Password reset not allowed.",
      });
    }

    // Check if new password and confirm password are provided
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide new password and confirm password.",
      });
    }

    // Check if new password matches confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    // Verify reset password token
    const secretKey = user._id + process.env.JWT_SECRET_KEY;
    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken || decodedToken.userId !== user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset password token.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reset password. Please try again later.",
    });
  }
};


// User log out
const userLogout = async (req, res) => {
  try {
    // Check if user is authenticated (assuming userId is set by authentication middleware)
    if (!req.id) {
      return res.status(400).json({
        success: false,
        message: "Please login first.",
      });
    }

    // Clear the authentication token (e.g., JWT token stored in a cookie)
    res.clearCookie("Token").status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed. Please try again later.",
    });
  }
};


module.exports = {
  userRegister,
  userLogin,
  userPasswordChange,
  forgotPasswordLinkSendByMail,
  userResetPassword,
  userLogout
};
