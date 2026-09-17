const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.generateCsrfToken = () => crypto.randomBytes(32).toString('hex');