const request = require('supertest');
const mongoose = require('mongoose');

// ── Mock the entire Url model so we never touch a real database ───────────────
const mockUrl = {
  _id: new mongoose.Types.ObjectId().toString(),
  originalUrl: 'https://www.google.com',
  shortCode: 'aB3kR9',
  customAlias: undefined,
  clicks: 0,
  createdAt: new Date().toISOString(),
  toJSON() { return this; },
};

jest.mock('../src/models/Url', () => {
  const actual = jest.requireActual('../src/models/Url');
  return {
    ...actual,
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };
});

// ── Set env vars before loading app ──────────────────────────────────────────
beforeAll(() => {
  process.env.MONGO_URI = 'mongodb://fake/test';
  process.env.BASE_URL = 'http://localhost:5000';
  process.env.NODE_ENV = 'test';
});

// ── Mock mongoose.connect so app startup doesn't fail ────────────────────────
jest.mock('../src/config/db', () => jest.fn().mockResolvedValue(true));

const Url = require('../src/models/Url');
const app = require('../src/app');

afterEach(() => {
  jest.clearAllMocks();
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const makeUrl = (overrides = {}) => ({
  ...mockUrl,
  _id: new mongoose.Types.ObjectId().toString(),
  shortCode: 'aB3kR9',
  clicks: 0,
  shortUrl: 'http://localhost:5000/aB3kR9',
  ...overrides,
  toJSON() { return this; },
});

// ── POST /api/urls ────────────────────────────────────────────────────────────
describe('POST /api/urls', () => {
  it('creates a short URL and returns 201', async () => {
    const url = makeUrl();
    Url.findOne.mockResolvedValue(null);   // no collision, no alias conflict
    Url.create.mockResolvedValue(url);

    const res = await request(app)
      .post('/api/urls')
      .send({ originalUrl: 'https://www.google.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('shortCode');
  });

  it('accepts a custom alias', async () => {
    const url = makeUrl({ customAlias: 'github' });
    Url.findOne.mockResolvedValue(null);
    Url.create.mockResolvedValue(url);

    const res = await request(app)
      .post('/api/urls')
      .send({ originalUrl: 'https://github.com', customAlias: 'github' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.customAlias).toBe('github');
  });

  it('returns 400 for a missing URL', async () => {
    const res = await request(app).post('/api/urls').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for an invalid URL', async () => {
    const res = await request(app)
      .post('/api/urls')
      .send({ originalUrl: 'not-a-url' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for a URL without protocol', async () => {
    const res = await request(app)
      .post('/api/urls')
      .send({ originalUrl: 'www.google.com' });
    expect(res.statusCode).toBe(400);
  });

  it('returns 409 for a duplicate custom alias', async () => {
    // findOne returns existing doc → alias taken
    Url.findOne.mockResolvedValue(makeUrl({ customAlias: 'mylink' }));

    const res = await request(app)
      .post('/api/urls')
      .send({ originalUrl: 'https://github.com', customAlias: 'mylink' });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for alias with special characters', async () => {
    const res = await request(app)
      .post('/api/urls')
      .send({ originalUrl: 'https://google.com', customAlias: 'my link!' });
    expect(res.statusCode).toBe(400);
  });
});

// ── GET /api/urls ─────────────────────────────────────────────────────────────
describe('GET /api/urls', () => {
  it('returns an empty list when no URLs exist', async () => {
    Url.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

    const res = await request(app).get('/api/urls');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(0);
    expect(res.body.count).toBe(0);
  });

  it('returns all created URLs', async () => {
    const urls = [makeUrl(), makeUrl({ shortCode: 'xY7zAb' })];
    Url.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(urls) });

    const res = await request(app).get('/api/urls');
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
    expect(res.body.data).toHaveLength(2);
  });
});

// ── DELETE /api/urls/:id ──────────────────────────────────────────────────────
describe('DELETE /api/urls/:id', () => {
  it('deletes an existing URL', async () => {
    const id = new mongoose.Types.ObjectId();
    Url.findByIdAndDelete.mockResolvedValue(makeUrl({ _id: id.toString() }));

    const res = await request(app).delete(`/api/urls/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns 404 for a non-existent ID', async () => {
    Url.findByIdAndDelete.mockResolvedValue(null);
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/urls/${id}`);
    expect(res.statusCode).toBe(404);
  });

  it('returns 400 for a malformed ID', async () => {
    const res = await request(app).delete('/api/urls/not-an-id');
    expect(res.statusCode).toBe(400);
  });
});

// ── GET /:shortCode (redirect) ────────────────────────────────────────────────
describe('GET /:shortCode', () => {
  it('redirects to the original URL', async () => {
    const url = makeUrl({ originalUrl: 'https://www.google.com' });
    Url.findOne.mockResolvedValue(url);
    Url.findByIdAndUpdate.mockResolvedValue(url);

    const res = await request(app).get('/aB3kR9');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('https://www.google.com');
  });

  it('works with a custom alias', async () => {
    const url = makeUrl({ originalUrl: 'https://github.com', customAlias: 'gh' });
    Url.findOne.mockResolvedValue(url);
    Url.findByIdAndUpdate.mockResolvedValue(url);

    const res = await request(app).get('/gh');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('https://github.com');
  });

  it('returns 404 for an unknown short code', async () => {
    Url.findOne.mockResolvedValue(null);
    const res = await request(app).get('/doesnotexist');
    expect(res.statusCode).toBe(404);
  });

  it('returns 410 for an expired URL', async () => {
    const expired = makeUrl({ expiresAt: new Date('2000-01-01') });
    Url.findOne.mockResolvedValue(expired);

    const res = await request(app).get('/aB3kR9');
    expect(res.statusCode).toBe(410);
    expect(res.body.error).toMatch(/expired/i);
  });

  it('calls findByIdAndUpdate to increment clicks', async () => {
    const url = makeUrl();
    Url.findOne.mockResolvedValue(url);
    Url.findByIdAndUpdate.mockResolvedValue(url);

    await request(app).get('/aB3kR9');
    expect(Url.findByIdAndUpdate).toHaveBeenCalledWith(
      url._id,
      { $inc: { clicks: 1 } }
    );
  });
});
