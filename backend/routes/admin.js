const express = require('express');
const router = express.Router();

router.get('/analytics', (req, res) => {
  res.status(501).json({ message: 'Admin analytics — not implemented yet' });
});

module.exports = router;