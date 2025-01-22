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
      isLatest ? 'bg-green-900 border-green-700' :
      release.prerelease ? 'bg-yellow-900 border-yellow-700' :
      'bg-gray-800 border-gray-700'
    } border`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h3 className="text-xl font-semibold">
          <a href={release.html_url} target="_blank" rel="noopener noreferrer" 
             className="text-blue-400 hover:underline">
            {release.tag_name}
          </a>
          {isLatest && <span className="ml-2 px-2 py-1 text-sm bg-green-700 text-white rounded">Latest</span>}
          {release.prerelease && <span className="ml-2 px-2 py-1 text-sm bg-yellow-700 text-white rounded">Pre-release</span>}
        </h3>
        <span className="text-gray-400">
          Released on {new Date(release.published_at).toLocaleDateString()}
        </span>
      </div>

      {release.assets.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-200">Downloads</h4>
          <ul className="space-y-2">
            {release.assets.map(asset => (
              <li key={asset.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="font-mono text-sm text-gray-300">{asset.name}</span>
                <div className="text-sm text-gray-400">
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