const mongoose = require("mongoose");

const TourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Tour",
    },
    url: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("tourDetails", TourSchema, "tourDetails");
