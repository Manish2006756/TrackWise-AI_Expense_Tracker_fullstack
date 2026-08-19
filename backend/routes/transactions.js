const express = require('express');
const router = express.Router();

const Transaction = require('../models/Transaction');
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');


// ======================================
// GET all transactions
// ======================================

router.get('/', authMiddleware, async (req, res) => {

  try {

    const transactions =
      await Transaction.find({
        user: req.userId
      }).sort({ date: -1 });

    res.status(200).json(transactions);

  } catch (err) {

    res.status(500).json({
      error: 'Failed to fetch transactions',
      details: err.message
    });

  }

});


// ======================================
// POST a new transaction
// ======================================

router.post('/add', authMiddleware, async (req, res) => {
console.log('AUTH USER ID:', req.userId);
  try {

    const { description, amount } = req.body;


    // Validate input
    if (!description || !amount) {

      return res.status(400).json({
        error: 'Description and amount are required'
      });

    }


    // AI automatically categorizes transaction
    const category =
      await aiController.categorizeTransaction(
        description
      );


    // Create transaction
    const transaction =
      new Transaction({

        description,

        amount: Number(amount),

        category,

        user: req.userId

      });


    await transaction.save();


    res.status(201).json(transaction);

  } catch (err) {

    res.status(500).json({
      error: 'Failed to save transaction',
      details: err.message
    });

  }

});


// ======================================
// GET AI spending insight
// ======================================

router.get('/insights', authMiddleware, async (req, res) => {

  try {

    const transactions =
      await Transaction.find({
        user: req.userId
      }).sort({ date: -1 });


    if (transactions.length === 0) {

      return res.status(200).json({
        insight:
          'Add some transactions first to get AI spending insights.'
      });

    }


    const insight =
      await aiController.generateSpendingInsight(
        transactions
      );


    res.status(200).json({
      insight
    });

  } catch (err) {

    res.status(500).json({
      error: 'Failed to generate spending insight',
      details: err.message
    });

  }

});


// ======================================
// DELETE a transaction
// ======================================

router.delete('/:id', authMiddleware, async (req, res) => {

  try {

    const transaction =
      await Transaction.findOneAndDelete({

        _id: req.params.id,

        user: req.userId

      });


    if (!transaction) {

      return res.status(404).json({
        error: 'Transaction not found'
      });

    }


    res.status(200).json({
      message: 'Transaction deleted successfully'
    });

  } catch (err) {

    res.status(500).json({
      error: 'Failed to delete transaction',
      details: err.message
    });

  }

});


module.exports = router;