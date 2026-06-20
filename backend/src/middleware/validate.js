const { body, param, validationResult } = require('express-validator');

// Reusable helper: reads validation errors and sends a 400 response if any exist
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg, // return the first error message
    });
  }
  next();
};

// Validation rules for POST /api/urls
const validateCreateUrl = [
  body('originalUrl')
    .notEmpty()
    .withMessage('URL is required')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Must be a valid URL starting with http:// or https://')
    .isLength({ max: 2048 })
    .withMessage('URL must be under 2048 characters'),

  body('customAlias')
    .optional()
    .isAlphanumeric()
    .withMessage('Custom alias must contain only letters and numbers')
    .isLength({ min: 3, max: 30 })
    .withMessage('Custom alias must be between 3 and 30 characters'),

  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expiry date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),

  handleValidationErrors,
];

// Validation rules for DELETE /api/urls/:id
const validateMongoId = [
  param('id').isMongoId().withMessage('Invalid URL ID'),
  handleValidationErrors,
];

module.exports = { validateCreateUrl, validateMongoId };
