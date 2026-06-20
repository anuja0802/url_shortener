const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customAlias: {
      type: String,
      trim: true,
      sparse: true, // only index documents where this field exists
      unique: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // auto-creates createdAt and updatedAt
  }
);

// TTL index: MongoDB auto-deletes expired documents
// The index is on expiresAt; documents where expiresAt is null are ignored
urlSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $type: 'date' } } }
);

// Virtual field: the full short URL (not stored in DB, computed on the fly)
urlSchema.virtual('shortUrl').get(function () {
  const code = this.customAlias || this.shortCode;
  return `${process.env.BASE_URL}/${code}`;
});

// Include virtuals when converting to JSON (for API responses)
urlSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Url', urlSchema);
