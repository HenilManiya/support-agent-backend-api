const mongoose = require("mongoose");

/* role Schema */
const groupExpenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default:null
        },
        amount: {
            type: String,
        },
        note:{
            type: String,
            default:null
        },
        transactionDate:{
            type:Date,
            default:new Date()
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "group",
        },
        members:{
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

module.exports = mongoose.model("groupExpense", groupExpenseSchema);
