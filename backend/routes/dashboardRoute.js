import express from 'express';
import {Transaction} from '../models/Users.js';
import {auth} from '../middleware/auth.js';
import multer from 'multer';
import { extractText } from '../middleware/extractText.js';
import { extract } from '../lib/NER.js';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });
export const dashboardRouter = express.Router();

dashboardRouter.get('/',auth, async (req,res) => { 
    try {
        const { start, end, page = 1, limit = 10 } = req.query;

        const filter = { userId: req?.userId };

        // Optional date filter
        if (start || end) {
            filter.date = {};
            if (start) filter.date.$gte = new Date(start);
            if (end) {
                const endDate = new Date(end);
                filter.date.$lte = endDate;
            }
        }

        const skip = (page - 1) * limit;

        const total = await Transaction.countDocuments(filter);

        // Fetch current page
        const data = await Transaction.find(filter)
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(limit);

        res.json({ data, total });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

dashboardRouter.post('/',auth, async (req, res) => {
  try {
    const newTransaction = new Transaction({
      ...req.body,
      userId: req.userId, 
    });
    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

dashboardRouter.put('/:id', auth ,async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Transaction not found or not authorized' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

dashboardRouter.delete('/:id',auth, async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found or not authorized' });
    }

    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

dashboardRouter.post(
  '/upload-receipt',
  upload.single('file'),
  extractText,auth,
  async (req, res) => {
    try {
      const rawText = req.rawText;
      const txs  = [];
      try {
                const nerResult = await extract(rawText);
                console.log(nerResult);
                txs.push({
                userId: req.userId,
                date:      new Date(nerResult.date),
                amount:    nerResult.amount,
                type:      nerResult.type,
                description: nerResult.description,
                category:  nerResult.category
                });

            } catch (err) {
                console.warn('Skipping line; Ner failed', err);
    }

        const inserted = await Transaction.insertMany(txs);

        res.json({ insertedCount: inserted.length, inserted });
    }  catch (err) {
    console.error('Upload/parse error:', err);
    res.status(500).json({ error: 'Failed to process statement.' });
  } finally {
    if (req.file) fs.unlink(req.file.path, () => {});
  }
});


