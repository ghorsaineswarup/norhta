module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    console.error(result.error.flatten());
    return res.status(400).json({ message: 'Invalid input' });
  }
  req.body = result.data;
  next();
};