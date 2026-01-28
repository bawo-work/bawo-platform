/**
 * Performance Dashboard - Internal tool for monitoring bundle size and load times
 */

'use client';

import { useEffect, useState } from 'react';
import { measurePageLoad, checkBundleSize, getConnectionType } from '@/lib/performance/metrics';

export default function PerformancePage() {
  const [loadTime, setLoadTime] = useState<number>(0);
  const [bundleSize, setBundleSize] = useState<{ success: boolean; size: number }>({ success: true, size: 0 });
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    // Measure on mount
    setLoadTime(measurePageLoad());
    setBundleSize(checkBundleSize());
    setConnectionType(getConnectionType());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Performance Dashboard</h1>

        {/* Bundle Size */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bundle Size</h2>
          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold text-gray-900">{bundleSize.size.toFixed(1)} KB</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                bundleSize.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {bundleSize.success ? '✅ Target met (<150KB)' : '❌ Exceeds target'}
            </span>
          </div>
        </div>

        {/* Page Load Time */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Page Load Time</h2>
          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-bold text-gray-900">{(loadTime / 1000).toFixed(2)}s</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                loadTime < 3000 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {loadTime < 3000 ? '✅ Target met (<3s)' : '⚠️ Needs improvement'}
            </span>
          </div>
        </div>

        {/* Connection Type */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Connection</h2>
          <p className="text-2xl font-bold text-gray-900">{connectionType.toUpperCase()}</p>
        </div>

        {/* Commands */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Analysis Commands</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded font-mono text-sm">
              <p className="text-gray-700 mb-1">Bundle analysis:</p>
              <code>npm run analyze</code>
            </div>
            <div className="p-3 bg-gray-50 rounded font-mono text-sm">
              <p className="text-gray-700 mb-1">Lighthouse 3G test:</p>
              <code>npm run lighthouse</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
