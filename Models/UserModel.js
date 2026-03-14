import mongoose from "mongoose";

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
    default: null, // null tant que l'utilisateur n'a pas accepté l'invitation
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

export default mongoose.model("User", userSchema);