const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: { type: String, default: null },
    email: { type: String, default: null },
    profileImage: { type: String, default: "" },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("user", UserSchema, "user");
