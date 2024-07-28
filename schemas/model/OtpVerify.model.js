const mongoose = require("mongoose");

const OTPSchema = mongoose.Schema({
    phoneNumber: { type: String, unique: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OtpVerify', OTPSchema, "OtpVerify");