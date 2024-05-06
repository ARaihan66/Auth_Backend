const { Schema, model } = require("mongoose");

const userSchema = Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },

    email: {
      type: String,
      require: true,
      trim: true,
    },

    password: {
      type: String,
      require: true,
      trim: true,
    },

    tc: {
      type: String,
      require: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const userModel = model("user", userSchema);

module.exports = userModel;
