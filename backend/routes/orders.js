const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create order — not implemented yet' });
});

router.get('/my-orders', (req, res) => {
  res.status(501).json({ message: 'Get my orders — not implemented yet' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Get order by id — not implemented yet' });
});

module.exports = router;