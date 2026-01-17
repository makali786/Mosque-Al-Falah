'use client';

import React, { useEffect, useState } from 'react';

const ApiView: React.FC = () => {
  const [resource, setResource] = useState<'settings' | 'collection'>(
    'settings'
  );
  const [depth, setDepth] = useState(1);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic URL construction
  const getUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const queryParams = new URLSearchParams();

    if (depth !== 1) queryParams.append('depth', depth.toString());

    if (resource === 'settings') {
      return `${baseUrl}/api/globals/prayer-time-settings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    } else {
      queryParams.append('limit', limit.toString());
      queryParams.append('page', page.toString());
      queryParams.append('sort', '-date');
      return `${baseUrl}/api/prayer-times?${queryParams.toString()}`;
    }
  };

  const url = getUrl();
  // Relative URL for display (Payload usually shows relative or full?)
  // Screenshot shows relative: "api/globals/our-services-page?..."
  const displayUrl = url.replace(
    typeof window !== 'undefined' ? window.location.origin : '',
    ''
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
        setData({ error: 'Failed to fetch data' });
      } finally {
        setLoading(false);
      }
    };

    // Debounce slightly to avoid rapid fetches on input change
    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
  }, [url]);

  return (
    <div className="bg-white rounded-[4px] border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200 space-y-6">
        {/* Resource Selector (Custom addition to handle the hybrid nature of this view) */}
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 w-24">
            Resource
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setResource('settings')}
              className={`px-3 py-1 text-sm rounded-sm border ${resource === 'settings' ? 'bg-gray-100 border-gray-300 font-medium' : 'border-transparent hover:bg-gray-50'}`}
            >
              Global: Settings
            </button>
            <button
              onClick={() => setResource('collection')}
              className={`px-3 py-1 text-sm rounded-sm border ${resource === 'collection' ? 'bg-gray-100 border-gray-300 font-medium' : 'border-transparent hover:bg-gray-50'}`}
            >
              Collection: Prayer Times
            </button>
          </div>
        </div>

        {/* API URL Display */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            API URL{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-gray-600 hover:underline break-all"
          >
            {displayUrl}
          </a>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-8">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-not-allowed opacity-75">
            <input
              type="checkbox"
              checked
              disabled
              className="rounded border-gray-300 text-blue-600"
            />
            Authenticated
          </label>

          {/* Depth */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Depth</label>
            <input
              type="number"
              min="0"
              max="10"
              value={depth}
              onChange={e => setDepth(Number(e.target.value))}
              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Collection specific controls */}
          {resource === 'collection' && (
            <>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">
                  Limit
                </label>
                <input
                  type="number"
                  min="1"
                  value={limit}
                  onChange={e => setLimit(Number(e.target.value))}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">
                  Page
                </label>
                <input
                  type="number"
                  min="1"
                  value={page}
                  onChange={e => setPage(Number(e.target.value))}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative min-h-[200px] bg-gray-50">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="text-gray-500 text-sm">Loading...</div>
          </div>
        )}
        <pre className="p-6 text-xs sm:text-sm font-mono text-gray-800 overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ApiView;
