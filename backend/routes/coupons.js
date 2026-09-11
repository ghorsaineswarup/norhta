const express = require('express');
const router = express.Router();

router.post('/validate', (req, res) => {
  res.status(501).json({ message: 'Validate coupon — not implemented yet' });
});

module.exports = router;