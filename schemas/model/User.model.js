const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    fullName: { type: String, default: null, },
    email: { type: String, default: null, },
    phoneNumber: { type: String, unique: true },
    gender: { type: String, default: null, },
    isVerified: { type: Boolean, default: false },
    profileImage: { type: String, default: "" },
    socket_id: {
        type: String,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role",
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = mongoose.model('user', UserSchema, "user");