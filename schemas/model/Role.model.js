const mongoose = require("mongoose");

/* role Schema */
const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("role", roleSchema);
