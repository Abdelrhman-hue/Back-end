const mongoose = require("mongoose");
const roles = require("../utils/roles");

const userSchema = new mongoose.Schema({
  fristname: {
    required: true,
    type: String,
  },
  lastname: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },

  phoneNumber: {
    required: true,
    type: String,
  },

  dateOfBirth: {
    required: true,
    type: Date,
  },

  password: {
    required: true,
    type: String,
  },
  token: {
    type: String,
  },
  roles: {
    type: [String],
    enum: [roles.USER, roles.ADMIN],
    default: [roles.USER],
  },
  resetCode: {
    type: String,
  },
  resetCodeExpiry: {
    type: Date,
  },
});

module.exports = mongoose.model("User", userSchema);
