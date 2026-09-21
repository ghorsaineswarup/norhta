const { z } = require('zod');

exports.validateCouponSchema = z.object({
  code: z.string().trim().min(1).max(30),
  subtotal: z.number().min(0),
});

exports.createCouponSchema = z.object({
  code: z.string().trim().min(2).max(30),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(0),
  minimumOrder: z.number().min(0).optional(),
  maxUses: z.number().int().min(1).optional(),
  expiresAt: z.string().optional(),
});