const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({

  description: {
    type: String,
    required: true,
    trim: true
  },

  amount: {
    type: Number,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

module.exports = mongoose.model(
  'Transaction',
  TransactionSchema
);