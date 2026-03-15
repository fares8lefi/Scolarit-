const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ["ADMIN", "TEACHER", "PARENT"],
    required: true,
  },
  status: {
    type: String,
    enum: ["INVITED", "ACTIVE", "DISABLED"],
    default: "INVITED",
  },
  invitationCode: {
    type: String,
  },
  invitationExpires: {
    type: Date,
  },
  phone: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);