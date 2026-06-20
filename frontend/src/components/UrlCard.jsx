import { useState } from 'react';
import { deleteUrl } from '../services/api';

export default function UrlCard({ url, onDeleted }) {
  const [copied, setCopied]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const shortUrl = `${import.meta.env.VITE_API_URL}/${url.customAlias || url.shortCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard API
      const input = document.createElement('input');
      input.value = shortUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this URL?')) return;
    setDeleting(true);
    try {
      await deleteUrl(url._id);
      onDeleted(url._id);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
      setDeleting(false);
    }
  };

  // Truncate long URLs for display
  const truncate = (str, n) => str.length > n ? str.slice(0, n) + '...' : str;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3">

      {/* URL info */}
      <div className="flex-1 min-w-0">
        {/* Short URL */}
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-600 font-medium text-sm hover:underline break-all"
        >
          {shortUrl}
        </a>

        {/* Original URL */}
        <p className="text-gray-400 text-xs mt-0.5 break-all">
          {truncate(url.originalUrl, 80)}
        </p>
      </div>

      {/* Click count */}
      <div className="flex items-center gap-1 text-sm text-gray-500 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>{url.clicks} {url.clicks === 1 ? 'click' : 'clicks'}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition text-gray-600 cursor-pointer"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-100 hover:bg-red-50 transition text-red-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {deleting ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
