// Global error handler — must have 4 parameters for Express to treat it as error middleware
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);

  // Mongoose duplicate key error (e.g. shortCode or customAlias conflict)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `${field === 'customAlias' ? 'Custom alias' : 'Short code'} already exists. Please choose another.`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ success: false, error: message });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format' });
  }

  // Default: internal server error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
