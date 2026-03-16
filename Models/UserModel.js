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
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    default: null
  },
  children: [{
    name: {
      type: String,
      required: true
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);