const express = require('express');
const router = express.Router();

router.get('/:productId', (req, res) => {
  res.status(501).json({ message: 'Get reviews for product — not implemented yet' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create review — not implemented yet' });
});

module.exports = router;