import { useState, useEffect } from 'react';
import { getAllUrls } from './services/api';
import ShortenForm from './components/ShortenForm';
import UrlList from './components/UrlList';

export default function App() {
  const [urls, setUrls]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => { fetchUrls(); }, []);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getAllUrls();
      setUrls(res.data.data);
    } catch {
      setError('Could not connect to backend. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e8e2d9', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#6c63ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>Shortly</div>
            <div style={{ fontSize: 11, color: '#999' }}>URL Shortener</div>
          </div>
        </div>
        <span style={{ background: '#eeecff', color: '#4a43c0', fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20 }}>
          {urls.length} {urls.length === 1 ? 'link' : 'links'}
        </span>
      </header>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '44px 24px 28px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Shorten any URL instantly</h1>
        <p style={{ fontSize: 14, color: '#888', marginTop: 6 }}>Paste a long link, get a short one. Track every click.</p>
      </div>

      {/* Main */}
      <main style={{ maxWidth: 560, margin: '0 auto', padding: '0 16px 60px' }}>

        <ShortenForm onUrlCreated={(u) => setUrls((prev) => [u, ...prev])} />

        {/* Stats */}
        {urls.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '16px 0' }}>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e2d9', padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>{urls.length}</div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Total links</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e2d9', padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>{totalClicks}</div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Total clicks</div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffd5d5', color: '#c0392b', fontSize: 13, padding: '10px 14px', borderRadius: 10, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{error}</span>
            <button onClick={fetchUrls} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Retry</button>
          </div>
        )}

        {/* List header */}
        {(urls.length > 0 || loading) && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Your links</span>
            <button onClick={fetchUrls} style={{ background: 'none', border: 'none', fontSize: 12, color: '#aaa', cursor: 'pointer' }}>Refresh</button>
          </div>
        )}

        <UrlList urls={urls} loading={loading} onDeleted={(id) => setUrls((prev) => prev.filter((u) => u._id !== id))} />

      </main>
    </div>
  );
}