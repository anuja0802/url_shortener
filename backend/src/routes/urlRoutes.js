const express = require('express');
const router = express.Router();

const { createUrl, getAllUrls, deleteUrl } = require('../controllers/urlController');
const { validateCreateUrl, validateMongoId } = require('../middleware/validate');
const { createUrlLimiter } = require('../middleware/rateLimiter');

router.post('/', createUrlLimiter, validateCreateUrl, createUrl);
router.get('/', getAllUrls);
router.delete('/:id', validateMongoId, deleteUrl);

module.exports = router;
