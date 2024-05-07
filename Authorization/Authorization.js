const jwt = require("jsonwebtoken");

const authorization = async (req, res, next) => {
  try {
    const token = req.cookies.Token;
    const {userId} = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(userId);
    req.id = userId;
    next()
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {authorization}
