const express = require('express');
const router = express.Router();

const Coupon = require('../models/Coupon');
const validate = require('../middleware/validate');
const { requireCsrf } = require('../middleware/auth');
const { validateCouponSchema } = require('../schemas/couponSchemas');

router.post('/validate', requireCsrf, validate(validateCouponSchema), async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ message: 'This coupon has reached its usage limit' });
    }

    if (subtotal < coupon.minimumOrder) {
      return res.status(400).json({
        message: `This coupon requires a minimum order of NPR ${coupon.minimumOrder.toLocaleString()}`,
      });
    }

    const discount =
      coupon.discountType === 'percentage'
        ? Math.round((subtotal * coupon.discountValue) / 100)
        : coupon.discountValue;

    res.json({ code: coupon.code, discount: Math.min(discount, subtotal) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;