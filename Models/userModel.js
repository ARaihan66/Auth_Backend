const { Schema, model } = require("mongoose");

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    tc: {
      type: Boolean,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const userModel = model("user", userSchema);

module.exports = userModel;
