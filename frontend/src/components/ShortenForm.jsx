import { useState } from 'react';
import { createUrl } from '../services/api';

export default function ShortenForm({ onUrlCreated }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!originalUrl.trim()) { setError('Please enter a URL'); return; }

    setLoading(true);
    try {
      const payload = { originalUrl: originalUrl.trim() };
      if (customAlias.trim()) payload.customAlias = customAlias.trim();
      const res = await createUrl(payload);
      onUrlCreated(res.data.data);
      setOriginalUrl('');
      setCustomAlias('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    fontSize: 14,
    border: '1px solid #e8e2d9',
    borderRadius: 10,
    outline: 'none',
    background: '#fff',
    color: '#1a1a1a',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#888',
    marginBottom: 5,
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8e2d9', padding: '20px' }}>

      {/* Long URL */}
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Long URL</label>
        <input
          style={inputStyle}
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://example.com/very/long/url"
        />
      </div>

      {/* Custom alias */}
      <div style={{ marginBottom: 4 }}>
        <label style={labelStyle}>Custom alias <span style={{ fontWeight: 400, color: '#bbb' }}>(optional)</span></label>
        <div style={{ display: 'flex' }}>
          <span style={{ padding: '10px 12px', background: '#f5f0e8', border: '1px solid #e8e2d9', borderRight: 'none', borderRadius: '10px 0 0 10px', fontSize: 13, color: '#aaa', whiteSpace: 'nowrap' }}>
            {import.meta.env.VITE_API_URL}/
          </span>
          <input
            style={{ ...inputStyle, borderRadius: '0 10px 10px 0', width: 'auto', flex: 1 }}
            type="text"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            placeholder="my-link"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p style={{ fontSize: 13, color: '#c0392b', background: '#fff0f0', border: '1px solid #ffd5d5', borderRadius: 8, padding: '8px 12px', margin: '10px 0 0' }}>
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{ width: '100%', marginTop: 14, padding: '11px', background: loading ? '#b0abf0' : '#6c63ff', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Shortening...' : 'Shorten URL'}
      </button>
    </form>
  );
}