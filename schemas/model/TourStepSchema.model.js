const mongoose = require('mongoose');

const TourStepSchema = new mongoose.Schema({
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tourDetails', // Assuming your user model is User.model.js
    required: true,
  },
  url: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  outerHTML: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('tourStep', TourStepSchema,'tourStep');
