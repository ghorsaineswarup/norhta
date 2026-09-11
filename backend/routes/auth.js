const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.status(501).json({ message: 'Register — not implemented yet' });
});

router.post('/login', (req, res) => {
  res.status(501).json({ message: 'Login — not implemented yet' });
});

router.get('/me', (req, res) => {
  res.status(501).json({ message: 'Get current user — not implemented yet' });
});

module.exports = router;