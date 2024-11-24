const mongoose = require("mongoose");

const VerificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Code expires in 10 minutes
});

const VerificationCode = mongoose.model("VerificationCode", VerificationCodeSchema);
module.exports = VerificationCode;
