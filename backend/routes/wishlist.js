const express = require('express');
const router = express.Router();
const { z } = require('zod');

const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

const addSchema = z.object({ productId: z.string().min(1) });

router.get('/', async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      'products',
      'name slug images price'
    );
    if (!wishlist) wishlist = { products: [] };
    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/add', validate(addSchema), async (req, res) => {
  try {
    const { productId } = req.body;
    const exists = await Product.findOne({ _id: productId, active: true });
    if (!exists) return res.status(404).json({ message: 'Product not found' });

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

    if (!wishlist.products.some((p) => p.toString() === productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const populated = await wishlist.populate('products', 'name slug images price');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.delete('/remove/:productId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== req.params.productId
    );
    await wishlist.save();

    const populated = await wishlist.populate('products', 'name slug images price');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;