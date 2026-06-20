import { useState } from 'react';
import { deleteUrl } from '../services/api';

export default function UrlCard({ url, onDeleted }) {
  const [copied, setCopied]     = useState(false);
  const [deleting, setDeleting] = useState(false);

  const shortUrl = `${import.meta.env.VITE_API_URL}/${url.customAlias || url.shortCode}`;
  const truncate = (str, n) => str.length > n ? str.slice(0, n) + '...' : str;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch {
      const el = document.createElement('input');
      el.value = shortUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const openLink = () => {
    window.open(shortUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e2d9', padding: '13px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          onClick={openLink}
          style={{ fontSize: 14, fontWeight: 600, color: '#6c63ff', cursor: 'pointer', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {shortUrl}
        </span>
        <span style={{ fontSize: 12, color: '#bbb', marginTop: 2, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {truncate(url.originalUrl, 60)}
        </span>
      </div>

      {/* Clicks */}
      <span style={{ fontSize: 12, color: '#aaa', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {url.clicks} {url.clicks === 1 ? 'click' : 'clicks'}
      </span>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          onClick={handleCopy}
          style={{ padding: '5px 12px', fontSize: 12, fontWeight: 500, borderRadius: 7, border: '1px solid #e8e2d9', background: copied ? '#e8f8f2' : '#f5f0e8', color: copied ? '#0a7a52' : '#555', cursor: 'pointer' }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{ padding: '5px 12px', fontSize: 12, fontWeight: 500, borderRadius: 7, border: '1px solid #ffd5d5', background: '#fff0f0', color: '#c0392b', cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.5 : 1 }}
        >
          {deleting ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}