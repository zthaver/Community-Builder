'use client';

import { useState, useEffect } from 'react';
import { WifiOffIcon, XIcon } from 'lucide-react';

export default function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check initial status
    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline || dismissed) {
    return null;
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white px-4 py-3 shadow-lg"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <WifiOffIcon className="w-6 h-6 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold text-lg">No Internet Connection</p>
            <p className="text-sm text-red-100">Please check your connection and try again.</p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-2 hover:bg-red-700 rounded-lg transition-colors shrink-0"
          aria-label="Dismiss offline notification"
        >
          <XIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
