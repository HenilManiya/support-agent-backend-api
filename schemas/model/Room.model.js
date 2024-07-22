const mongoose = require("mongoose");

/* role Schema */
const roomSchema = new mongoose.Schema(
  {
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("room", roomSchema);
