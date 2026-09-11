const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get cart — not implemented yet' });
});

router.post('/add', (req, res) => {
  res.status(501).json({ message: 'Add to cart — not implemented yet' });
});

router.put('/update', (req, res) => {
  res.status(501).json({ message: 'Update cart item — not implemented yet' });
});

router.delete('/remove', (req, res) => {
  res.status(501).json({ message: 'Remove cart item — not implemented yet' });
});

module.exports = router;