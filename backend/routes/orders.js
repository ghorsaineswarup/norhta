const express = require('express');
const router = express.Router();

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const validate = require('../middleware/validate');
const { requireAuth, requireCsrf } = require('../middleware/auth');
const { checkoutSchema } = require('../schemas/orderSchemas');

router.use(requireAuth);
router.use(requireCsrf);

function calculateShipping(city, subtotal) {
  if (subtotal >= 10000) return 0;
  const isValley = /kathmandu|lalitpur|bhaktapur/i.test(city);
  return isValley ? 100 : 200;
}

router.post('/', validate(checkoutSchema), async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = [];
    let subtotal = 0;
    const stockUpdates = [];

    for (const item of cart.items) {
      const product = await Product.findOne({ _id: item.product, active: true });
      if (!product) {
        return res.status(400).json({ message: 'A product in your cart is no longer available' });
      }

      let price = product.price;
      let variant = null;

      if (item.variantSku) {
        variant = product.variants.find((v) => v.sku === item.variantSku);
        if (!variant) {
          return res.status(400).json({ message: `Variant unavailable for ${product.name}` });
        }
        price = variant.price ?? product.price;
        if (variant.stock < item.quantity) {
          return res.status(400).json({
            message: `Only ${variant.stock} left for ${product.name} (${variant.color || ''})`,
          });
        }
      } else if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Only ${product.stock} left for ${product.name}` });
      }

      subtotal += price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        variantSku: item.variantSku,
        quantity: item.quantity,
        price,
      });
      stockUpdates.push({ productId: product._id, variantSku: item.variantSku, quantity: item.quantity });
    }

    const shippingCost = calculateShipping(shippingAddress.city, subtotal);

    let discount = 0;
    let appliedCoupon = null;
    if (req.body.couponCode) {
      const coupon = await Coupon.findOne({ code: req.body.couponCode.toUpperCase(), active: true });
      if (
        coupon &&
        (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
        (!coupon.maxUses || coupon.usedCount < coupon.maxUses) &&
        subtotal >= coupon.minimumOrder
      ) {
        discount =
          coupon.discountType === 'percentage'
            ? Math.round((subtotal * coupon.discountValue) / 100)
            : Math.min(coupon.discountValue, subtotal);
        appliedCoupon = coupon;
      }
    }

    const total = subtotal - discount + shippingCost;

    for (const update of stockUpdates) {
      let result;
      if (update.variantSku) {
        result = await Product.findOneAndUpdate(
          { _id: update.productId, 'variants.sku': update.variantSku, 'variants.stock': { $gte: update.quantity } },
          { $inc: { 'variants.$.stock': -update.quantity } }
        );
      } else {
        result = await Product.findOneAndUpdate(
          { _id: update.productId, stock: { $gte: update.quantity } },
          { $inc: { stock: -update.quantity } }
        );
      }
      if (!result) {
        return res.status(409).json({ message: 'Stock changed while placing your order. Please review your cart.' });
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      discount,
      shippingCost,
      total,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      coupon: appliedCoupon?._id,
    });

    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save();
    }

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/:id/pay', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.paymentMethod === 'cod') {
      return res.status(400).json({ message: 'This order is Cash on Delivery' });
    }
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    // Sandbox/demo payment confirmation — no real gateway integration.
    // In production this would verify a signed callback from eSewa/Khalti.
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/my-orders', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;