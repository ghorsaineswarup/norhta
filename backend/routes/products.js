const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

const ALLOWED_SORTS = {
  featured: { featured: -1, createdAt: -1 },
  newest: { createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1 },
};

router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;

    const query = { active: true };

    // Search: plain string match against name/description, safe from injection
    // because it's passed as a value, never concatenated into raw query syntax.
    if (search && typeof search === 'string') {
      const safeSearch = search.trim().slice(0, 100); // cap length, defensive
      if (safeSearch) {
        query.$or = [
          { name: { $regex: safeSearch, $options: 'i' } },
          { description: { $regex: safeSearch, $options: 'i' } },
          { shortDescription: { $regex: safeSearch, $options: 'i' } },
        ];
      }
    }

    // Category filter: resolve slug -> ObjectId, never trust a raw id from the client
    if (category && typeof category === 'string') {
      const cat = await Category.findOne({ slug: category, active: true });
      if (cat) {
        query.category = cat._id;
      } else {
        // Unknown category slug -> no results, not an error
        return res.json([]);
      }
    }

    // Price range: parse and validate as numbers, ignore garbage input
    const priceFilter = {};
    if (minPrice !== undefined) {
      const min = Number(minPrice);
      if (!Number.isNaN(min) && min >= 0) priceFilter.$gte = min;
    }
    if (maxPrice !== undefined) {
      const max = Number(maxPrice);
      if (!Number.isNaN(max) && max >= 0) priceFilter.$lte = max;
    }
    if (Object.keys(priceFilter).length > 0) {
      query.price = priceFilter;
    }

    // Sort: only ever use a value from our fixed allowlist, never build
    // a sort object directly from client input.
    const sortKey = typeof sort === 'string' && ALLOWED_SORTS[sort] ? sort : 'featured';
    const sortObj = ALLOWED_SORTS[sortKey];

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortObj);

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, active: true }).populate(
      'category',
      'name slug'
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;