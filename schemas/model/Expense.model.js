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
        // isGroupExpense:{
        //     type:Boolean,
        //     default:false
        // },
        groupExpenseId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "groupExpense",
        },
        note:{
            type: String,
            default:null
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
