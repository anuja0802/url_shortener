const Url = require('../models/Url');
const { generateUniqueCode } = require('../utils/generateCode');

// POST /api/urls
// Creates a new short URL
const createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;

    // If a custom alias is provided, check it's not already taken
    if (customAlias) {
      const existing = await Url.findOne({ customAlias });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'Custom alias already taken. Please choose another.',
        });
      }
    }

    // Generate a unique short code
    const shortCode = await generateUniqueCode();

    const url = await Url.create({
      originalUrl,
      shortCode,
      customAlias: customAlias || undefined,
      expiresAt: expiresAt || null,
    });

    res.status(201).json({
      success: true,
      data: url,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/urls
// Returns all URLs, most recent first
const getAllUrls = async (req, res, next) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: urls.length,
      data: urls,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/urls/:id
// Deletes a URL by its MongoDB _id
const deleteUrl = async (req, res, next) => {
  try {
    const url = await Url.findByIdAndDelete(req.params.id);

    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'URL not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'URL deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// GET /:shortCode
// Redirects to the original URL and increments the click counter
const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Search both shortCode and customAlias fields
    const url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }],
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'URL not found',
      });
    }

    // Check expiry
    if (url.expiresAt && url.expiresAt < new Date()) {
      return res.status(410).json({
        success: false,
        error: 'This URL has expired',
      });
    }

    // Increment click count without fetching the document again
    await Url.findByIdAndUpdate(url._id, { $inc: { clicks: 1 } });

    return res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = { createUrl, getAllUrls, deleteUrl, redirectUrl };
