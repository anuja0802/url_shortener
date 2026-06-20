import { useState } from 'react';
import { createUrl } from '../services/api';

export default function ShortenForm({ onUrlCreated }) {
  const [originalUrl, setOriginalUrl]   = useState('');
  const [customAlias, setCustomAlias]   = useState('');
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!originalUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const payload = { originalUrl: originalUrl.trim() };
      if (customAlias.trim()) payload.customAlias = customAlias.trim();

      const res = await createUrl(payload);
      onUrlCreated(res.data.data);

      // Reset form
      setOriginalUrl('');
      setCustomAlias('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Shorten a URL</h2>

      {/* URL input */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Long URL <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://example.com/very/long/url"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
        />
      </div>

      {/* Custom alias input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Custom alias <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex items-center gap-0">
          <span className="px-3 py-2.5 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-400">
            {import.meta.env.VITE_API_URL}/
          </span>
          <input
            type="text"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            placeholder="my-link"
            className="flex-1 px-4 py-2.5 rounded-r-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 mb-3 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-medium rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? 'Shortening...' : 'Shorten URL'}
      </button>
    </form>
  );
}
