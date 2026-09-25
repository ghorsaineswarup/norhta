require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
  { name: 'Packs', slug: 'packs', description: 'Technical trekking and hiking packs.' },
  { name: 'Jackets', slug: 'jackets', description: 'Alpine shells and insulated jackets.' },
  { name: 'Footwear', slug: 'footwear', description: 'Technical hiking boots and shoes.' },
  { name: 'Sleep Systems', slug: 'sleep-systems', description: 'Sleeping bags for expedition conditions.' },
  { name: 'Equipment', slug: 'equipment', description: 'Trekking poles, headlamps, and accessories.' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing products and categories');

    const createdCategories = await Category.insertMany(categories);
    console.log(`Inserted ${createdCategories.length} categories`);

    const findCat = (slug) => createdCategories.find((c) => c.slug === slug)._id;

    const products = [
      {
        name: 'NORHTA A45',
        slug: 'a45',
        shortDescription: 'Technical 45L Trekking Pack',
        description:
          'A weather-resistant 45L trekking pack built from 700D ripstop with an aluminium frame and ergonomic suspension, engineered for multi-day approaches above the treeline.',
        category: findCat('packs'),
        price: 18900,
        images: ['/products/NORTHA_A45.jpg'],
        specifications: { Capacity: '45L', Weight: '1.4kg', Material: '700D Ripstop', Frame: 'Aluminium' },
        stock: 24,
        featured: true,
      },
      {
        name: 'NORHTA A28',
        slug: 'a28',
        shortDescription: 'Technical 28L Hiking Pack',
        description: 'A lighter 28L pack suited for single-day and shorter multi-day treks.',
        category: findCat('packs'),
        price: 14900,
        images: ['/products/NORTHA_A28.jpg'],
        specifications: { Capacity: '28L', Weight: '1.1kg', Material: '600D Ripstop' },
        stock: 30,
      },
      {
        name: 'NORHTA ALPINE X1',
        slug: 'alpine-x1',
        shortDescription: 'Technical Alpine Shell',
        description: 'A fully waterproof alpine shell with an adjustable hood, YKK zippers, and full wind protection.',
        category: findCat('jackets'),
        price: 24500,
        images: ['/products/ALPINE_X1.jpg'],
        specifications: { Waterproof: 'Yes', Zippers: 'YKK', Hood: 'Adjustable' },
        stock: 18,
        featured: true,
      },
      {
        name: 'NORHTA DOWN 800',
        slug: 'down-800',
        shortDescription: '800-fill Down Jacket',
        description: 'Premium 800-fill down insulation for extreme cold conditions.',
        category: findCat('jackets'),
        price: 28900,
        images: ['/products/DOWN_800.jpg'],
        specifications: { Fill: '800', Insulation: 'Down' },
        stock: 12,
      },
      {
        name: 'NORHTA TREK-01',
        slug: 'trek-01',
        shortDescription: 'Technical Hiking Boot',
        description: 'A high-traction hiking boot with a Vibram-style outsole, waterproof upper, and reinforced toe cap.',
        category: findCat('footwear'),
        price: 16800,
        images: ['/products/trek_01.jpg'],
        specifications: { Outsole: 'Vibram-style', Waterproof: 'Yes' },
        stock: 20,
        featured: true,
      },
      {
        name: 'NORHTA TRAIL-02',
        slug: 'trail-02',
        shortDescription: 'Light Hiking Shoe',
        description: 'A lightweight hiking shoe for day hikes and fast approaches.',
        category: findCat('footwear'),
        price: 13500,
        images: ['/products/trial_01.jpg'],
        specifications: { Weight: '650g/pair' },
        stock: 25,
      },
      {
        name: 'NORHTA SLEEP 700',
        slug: 'sleep-700',
        shortDescription: '700-fill Sleeping Bag',
        description: 'A warm 700-fill sleeping bag rated for high-altitude expedition conditions.',
        category: findCat('sleep-systems'),
        price: 29900,
        images: ['/products/SLEEP_700.jpg'],
        specifications: { Fill: '700' },
        stock: 10,
      },
      {
        name: 'NORHTA SLEEP 400',
        slug: 'sleep-400',
        shortDescription: 'Lightweight Sleeping Bag',
        description: 'A lighter sleeping bag suited to milder conditions and lower-altitude treks.',
        category: findCat('sleep-systems'),
        price: 19900,
        images: ['/products/SLEEP_400.jpg'],
        specifications: { Fill: '400' },
        stock: 16,
      },
      {
        name: 'NORHTA Trekking Poles',
        slug: 'trekking-poles',
        shortDescription: 'Adjustable Carbon Trekking Poles',
        description: 'Lightweight, adjustable carbon trekking poles with cork grips.',
        category: findCat('equipment'),
        price: 6500,
        images: ['/products/trekking_poles.jpg'],
        stock: 40,
      },
      {
        name: 'NORHTA Headlamp',
        slug: 'headlamp',
        shortDescription: 'Rechargeable LED Headlamp',
        description: 'A bright, rechargeable headlamp with multiple brightness modes.',
        category: findCat('equipment'),
        price: 3200,
        images: ['/products/head_lamp.jpg'],
        stock: 50,
      },
      {
        name: 'NORHTA Technical Gloves',
        slug: 'technical-gloves',
        shortDescription: 'Insulated Technical Gloves',
        description: 'Weatherproof insulated gloves for cold-weather trekking.',
        category: findCat('equipment'),
        price: 2800,
        images: ['/products/technical_gloves.jpg'],
        stock: 45,
      },
      {
        name: 'NORHTA Water Bottle',
        slug: 'water-bottle',
        shortDescription: 'Insulated Steel Water Bottle',
        description: 'A durable, insulated steel water bottle for trekking and daily use.',
        category: findCat('equipment'),
        price: 1500,
        images: ['/products/water_bottle.jpg'],
        stock: 60,
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`Inserted ${createdProducts.length} products`);

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();