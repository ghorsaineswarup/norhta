const express = require('express');
const router = express.Router();
const { z } = require('zod');

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const validate = require('../middleware/validate');
const { requireAuth, requireCsrf } = require('../middleware/auth');

const itemSchema = z.object({
  productId: z.string().min(1),
  variantSku: z.string().optional(),
  quantity: z.number().int().min(1).max(99),
});

// Every cart route requires a real session — a cart belongs to req.user, never
// to whatever userId the client might try to send in the body.
router.use(requireAuth);
router.use(requireCsrf);

async function resolveItem(productId, variantSku, quantity) {
  const product = await Product.findOne({ _id: productId, active: true });
  if (!product) return { error: 'Product not found' };

  let price = product.price;
  let stock = product.stock;

  if (variantSku) {
    const variant = product.variants.find((v) => v.sku === variantSku);
    if (!variant) return { error: 'Variant not found' };
    price = variant.price ?? product.price;
    stock = variant.stock;
  }

  if (quantity > stock) {
    return { error: `Only ${stock} in stock` };
  }

  return { product, price };
}

router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name slug images price'
    );
    if (!cart) cart = { items: [] };
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/add', validate(itemSchema), async (req, res) => {
  try {
    const { productId, variantSku, quantity } = req.body;
    const result = await resolveItem(productId, variantSku, quantity);
    if (result.error) return res.status(400).json({ message: result.error });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existing = cart.items.find(
      (i) => i.product.toString() === productId && i.variantSku === variantSku
    );

    if (existing) {
      const newQty = existing.quantity + quantity;
      const check = await resolveItem(productId, variantSku, newQty);
      if (check.error) return res.status(400).json({ message: check.error });
      existing.quantity = newQty;
      existing.price = check.price; // always re-priced from the DB, never trusted from client
    } else {
      cart.items.push({ product: productId, variantSku, quantity, price: result.price });
    }

    await cart.save();
    const populated = await cart.populate('items.product', 'name slug images price');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.put('/update', validate(itemSchema), async (req, res) => {
  try {
    const { productId, variantSku, quantity } = req.body;
    const result = await resolveItem(productId, variantSku, quantity);
    if (result.error) return res.status(400).json({ message: result.error });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(
      (i) => i.product.toString() === productId && i.variantSku === variantSku
    );
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.quantity = quantity;
    item.price = result.price;

    await cart.save();
    const populated = await cart.populate('items.product', 'name slug images price');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.delete('/remove', async (req, res) => {
  try {
    const { productId, variantSku } = req.query;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      (i) => !(i.product.toString() === productId && i.variantSku === variantSku)
    );

    await cart.save();
    const populated = await cart.populate('items.product', 'name slug images price');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;