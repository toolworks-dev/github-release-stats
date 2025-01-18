import { Release } from '../types';

interface Props {
  release: Release;
  isLatest: boolean;
}

export function ReleaseCard({ release, isLatest }: Props) {
  const formatBytes = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className={`p-6 rounded-lg shadow-md mb-4 ${
      isLatest ? 'bg-green-50 border-green-200' :
      release.prerelease ? 'bg-yellow-50 border-yellow-200' :
      'bg-gray-50 border-gray-200'
    } border`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">
          <a href={release.html_url} target="_blank" rel="noopener noreferrer" 
             className="text-blue-600 hover:underline">
            {release.tag_name}
          </a>
          {isLatest && <span className="ml-2 px-2 py-1 text-sm bg-green-500 text-white rounded">Latest</span>}
          {release.prerelease && <span className="ml-2 px-2 py-1 text-sm bg-yellow-500 text-white rounded">Pre-release</span>}
        </h3>
        <span className="text-gray-500">
          Released on {new Date(release.published_at).toLocaleDateString()}
        </span>
      </div>

      {release.assets.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Downloads</h4>
          <ul className="space-y-2">
            {release.assets.map(asset => (
              <li key={asset.name} className="flex items-center justify-between">
                <span className="font-mono text-sm">{asset.name}</span>
                <div className="text-sm text-gray-600">
                  <span>{formatBytes(asset.size)}</span>
                  <span className="mx-2">•</span>
                  <span>{formatNumber(asset.download_count)} downloads</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 