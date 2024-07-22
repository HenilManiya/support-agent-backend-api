const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: {
            // type: String,
            // default: null,
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        message: {
            type: String,
            default: null,
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "room",
            required: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


module.exports = mongoose.model('message', messageSchema, "message");