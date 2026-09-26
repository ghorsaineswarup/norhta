const express = require('express');
const router = express.Router();
const { z } = require('zod');

const Subscriber = require('../models/Subscriber');
const validate = require('../middleware/validate');

const subscribeSchema = z.object({
  email: z.string().email().max(200),
});

router.post('/subscribe', validate(subscribeSchema), async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.json({ message: 'Already subscribed' });
    }

    await Subscriber.create({ email });
    res.status(201).json({ message: 'Subscribed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;