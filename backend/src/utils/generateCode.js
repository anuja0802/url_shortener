const { customAlphabet } = require('nanoid');
const Url = require('../models/Url');

// Base62 alphabet: digits + lowercase + uppercase = 62 characters
// 6 characters gives 62^6 = ~56 billion possible codes
const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CODE_LENGTH = 6;

const generateNanoId = customAlphabet(BASE62_ALPHABET, CODE_LENGTH);

/**
 * Generates a unique short code that does not already exist in the database.
 * Retries up to MAX_ATTEMPTS times to handle the (extremely rare) collision case.
 */
const generateUniqueCode = async () => {
  const MAX_ATTEMPTS = 5;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = generateNanoId();

    // Check for collision
    const existing = await Url.findOne({ shortCode: code });
    if (!existing) {
      return code; // no collision, safe to use
    }
  }

  // This should never happen in practice, but we handle it gracefully
  throw new Error('Failed to generate a unique short code. Please try again.');
};

module.exports = { generateUniqueCode };
