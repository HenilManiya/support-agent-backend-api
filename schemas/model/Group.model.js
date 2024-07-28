const mongoose = require("mongoose");

/* role Schema */
const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        members: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "user",
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default:null
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("group", groupSchema);
