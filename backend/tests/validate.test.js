const { customAlphabet } = require('nanoid');

// Mock the Url model — isolated unit test, no DB
jest.mock('../src/models/Url', () => ({
  findOne: jest.fn(),
}));

const { generateUniqueCode } = require('../src/utils/generateCode');
const Url = require('../src/models/Url');

beforeEach(() => {
  jest.clearAllMocks();
  Url.findOne.mockResolvedValue(null); // default: no collision
});

describe('generateUniqueCode', () => {
  it('returns a string', async () => {
    const code = await generateUniqueCode();
    expect(typeof code).toBe('string');
  });

  it('returns a code of length 6', async () => {
    const code = await generateUniqueCode();
    expect(code).toHaveLength(6);
  });

  it('returns only Base62 characters', async () => {
    const code = await generateUniqueCode();
    expect(code).toMatch(/^[a-zA-Z0-9]+$/);
  });

  it('generates different codes on multiple calls', async () => {
    const codes = await Promise.all([
      generateUniqueCode(),
      generateUniqueCode(),
      generateUniqueCode(),
    ]);
    const unique = new Set(codes);
    expect(unique.size).toBe(3);
  });

  it('retries once when first code collides', async () => {
    // First findOne returns a collision, second returns null (free)
    Url.findOne
      .mockResolvedValueOnce({ shortCode: 'exists1' })
      .mockResolvedValueOnce(null);

    const code = await generateUniqueCode();
    expect(typeof code).toBe('string');
    expect(code).toHaveLength(6);
    expect(Url.findOne).toHaveBeenCalledTimes(2);
  });

  it('throws after 5 consecutive collisions', async () => {
    Url.findOne.mockResolvedValue({ shortCode: 'always-exists' });
    await expect(generateUniqueCode()).rejects.toThrow(
      'Failed to generate a unique short code'
    );
  });
});
