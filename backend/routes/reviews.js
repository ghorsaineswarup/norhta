const express = require('express');
const router = express.Router();

const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const validate = require('../middleware/validate');
const { requireAuth, requireCsrf } = require('../middleware/auth');
const { reviewSchema } = require('../schemas/reviewSchemas');

router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, approved: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/', requireAuth, requireCsrf, validate(reviewSchema), async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    const product = await Product.findOne({ _id: productId, active: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const hasPurchased = await Order.exists({
      user: req.user._id,
      'items.product': productId,
      orderStatus: { $ne: 'cancelled' },
    });

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      title,
      comment,
      verifiedPurchase: !!hasPurchased,
    });

    const stats = await Review.aggregate([
      { $match: { product: product._id, approved: true } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    product.rating = stats[0]?.avg || rating;
    product.reviewCount = stats[0]?.count || 1;
    await product.save();

    const populated = await review.populate('user', 'name');
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;