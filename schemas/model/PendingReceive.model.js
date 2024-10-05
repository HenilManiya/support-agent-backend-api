const mongoose = require("mongoose");

/* role Schema */
const penfingReveiveSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default:null
        },
        paybleUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            require:true
        },
        amount:{
            type: Number,
            default:0
        },
        transactionDate:{
            type:Date,
            default:new Date()
        },
        note:{
            type: String,
            default:null
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        expenseId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "expense",
        },
        isPayed:{
            type: Boolean,
            default:false
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("penfingreceive", penfingReveiveSchema);
