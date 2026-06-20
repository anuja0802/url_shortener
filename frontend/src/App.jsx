import { useState, useEffect } from 'react';
import { getAllUrls } from './services/api';
import ShortenForm from './components/ShortenForm';
import UrlList from './components/UrlList';

export default function App() {
  const [urls, setUrls]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const res = await getAllUrls();
      setUrls(res.data.data);
    } catch {
      setError('Failed to load URLs. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlCreated = (newUrl) => {
    setUrls((prev) => [newUrl, ...prev]);
  };

  const handleUrlDeleted = (deletedId) => {
    setUrls((prev) => prev.filter((u) => u._id !== deletedId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">URL Shortener</h1>
            <p className="text-xs text-gray-400 mt-0.5">Shorten, share, and track your links</p>
          </div>
          <span className="text-xs bg-violet-50 text-violet-600 font-medium px-2.5 py-1 rounded-full">
            {urls.length} {urls.length === 1 ? 'link' : 'links'}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <ShortenForm onUrlCreated={handleUrlCreated} />

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchUrls} className="text-red-400 hover:text-red-600 underline text-xs ml-4">
              Retry
            </button>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Your links
            </h2>
            {urls.length > 0 && (
              <button onClick={fetchUrls} className="text-xs text-gray-400 hover:text-gray-600 transition">
                Refresh
              </button>
            )}
          </div>
          <UrlList urls={urls} onDeleted={handleUrlDeleted} loading={loading} />
        </div>
      </main>
    </div>
  );
}
