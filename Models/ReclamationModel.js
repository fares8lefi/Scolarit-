const mongoose = require("mongoose");

const reclamationSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["PENDING", "RESOLVED", "REJECTED"],
    default: "PENDING"
  },
  adminComment: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Reclamation", reclamationSchema);
