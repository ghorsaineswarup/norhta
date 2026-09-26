const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const User = require('../models/User');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { signToken, generateCsrfToken } = require('../utils/token');
const { registerSchema, loginSchema } = require('../schemas/authSchemas');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts, try again later' },
});

function setAuthCookies(res, token) {
  const csrfToken = generateCsrfToken();
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie('csrfToken', csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.setHeader('X-CSRF-Token', csrfToken);
  return csrfToken;
}

router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Registration failed' });
    }

    const user = await User.create({ name, email, password, phone });
    const token = signToken(user._id);
    setAuthCookies(res, token);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/login', loginLimiter, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    const valid = user && (await user.comparePassword(password));

    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id);
    const csrfToken = setAuthCookies(res, token);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      csrfToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('csrfToken');
  res.json({ message: 'Logged out' });
});

router.get('/me', requireAuth, (req, res) => {
  const { _id, name, email, role, phone, address } = req.user;
  res.json({ id: _id, name, email, role, phone, address });
});

module.exports = router;