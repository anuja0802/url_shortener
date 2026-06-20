import UrlCard from './UrlCard';

export default function UrlList({ urls, onDeleted, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-1">No URLs yet</p>
        <p className="text-sm">Shorten your first URL above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {urls.map((url) => (
        <UrlCard key={url._id} url={url} onDeleted={onDeleted} />
      ))}
    </div>
  );
}
