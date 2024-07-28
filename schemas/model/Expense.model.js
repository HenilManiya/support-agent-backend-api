const mongoose = require("mongoose");

/* role Schema */
const expenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default:null
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            require:true
        },
        transactionType:{
            type: String,
            default:null
        },
        amount:{
            type: Number,
            default:0
        },
        transactionDate:{
            type:Date,
            default:new Date()
        },
        isGroupExpense:{
            type:Boolean,
            default:false
        },
        groupId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "group",
        },
        groupTotalAmount:{
            type: Number,
            default:0
        },
        note:{
            type: String,
            default:null
        },
        members:{
            type: [mongoose.Schema.Types.ObjectId],
            ref: "user",
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("expense", expenseSchema);
