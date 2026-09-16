const { z } = require('zod');

exports.checkoutSchema = z.object({
  shippingAddress: z.object({
    street: z.string().trim().min(3).max(200),
    city: z.string().trim().min(2).max(100),
    province: z.string().trim().min(2).max(100),
    postalCode: z.string().trim().min(2).max(20),
    phone: z.string().trim().min(5).max(20),
  }),
  paymentMethod: z.enum(['esewa', 'khalti', 'cod']),
});