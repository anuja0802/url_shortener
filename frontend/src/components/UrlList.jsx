import UrlCard from './UrlCard';

export default function UrlList({ urls, onDeleted, loading }) {
  if (loading) {
    return (
      <div>
        {[1, 2, 3].map((n) => (
          <div key={n} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e2d9', padding: '13px 16px', marginBottom: 8 }}>
            <div style={{ height: 14, background: '#f0ebe3', borderRadius: 6, width: '40%', marginBottom: 8 }} />
            <div style={{ height: 11, background: '#f0ebe3', borderRadius: 6, width: '65%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: '#bbb' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🔗</div>
        <p style={{ fontSize: 14, margin: 0 }}>No links yet</p>
        <p style={{ fontSize: 13, margin: '4px 0 0', color: '#ccc' }}>Shorten your first URL above</p>
      </div>
    );
  }

  return (
    <div>
      {urls.map((url) => (
        <UrlCard key={url._id} url={url} onDeleted={onDeleted} />
      ))}
    </div>
  );
}