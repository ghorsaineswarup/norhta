const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'List products — not implemented yet' });
});

router.get('/:slug', (req, res) => {
  res.status(501).json({ message: 'Get product by slug — not implemented yet' });
});

module.exports = router;