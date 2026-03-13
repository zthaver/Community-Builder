'use client';

import { useState, useEffect } from 'react';
import { ZoomInIcon, ZoomOutIcon, RotateCcwIcon, XIcon } from 'lucide-react';

const ZOOM_LEVELS = [100, 125, 150, 175, 200];
const STORAGE_KEY = 'community-builder-zoom-level';

export default function ScreenMagnifier() {
  const [isOpen, setIsOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    const savedZoom = localStorage.getItem(STORAGE_KEY);
    if (savedZoom) {
      const zoom = parseInt(savedZoom, 10);
      setZoomLevel(zoom);
      applyZoom(zoom);
    }
  }, []);

  const applyZoom = (level: number) => {
    document.documentElement.style.fontSize = `${level}%`;
    localStorage.setItem(STORAGE_KEY, level.toString());
  };

  const handleZoomIn = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      const newZoom = ZOOM_LEVELS[currentIndex + 1];
      setZoomLevel(newZoom);
      applyZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel);
    if (currentIndex > 0) {
      const newZoom = ZOOM_LEVELS[currentIndex - 1];
      setZoomLevel(newZoom);
      applyZoom(newZoom);
    }
  };

  const handleReset = () => {
    setZoomLevel(100);
    applyZoom(100);
  };

  const canZoomIn = zoomLevel < ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
  const canZoomOut = zoomLevel > ZOOM_LEVELS[0];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Open text size controls"
          title="Adjust text size"
        >
          <ZoomInIcon size={32} aria-hidden="true" />
        </button>
      )}

      {/* Expanded controls panel */}
      {isOpen && (
        <div 
          className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-5 min-w-[280px]"
          role="dialog"
          aria-label="Text size controls"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Text Size</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close text size controls"
            >
              <XIcon size={24} aria-hidden="true" />
            </button>
          </div>

          {/* Current zoom level display */}
          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-blue-600" aria-live="polite">
              {zoomLevel}%
            </span>
            <p className="text-gray-600 mt-1">Current text size</p>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={handleZoomOut}
              disabled={!canZoomOut}
              className="flex items-center justify-center w-14 h-14 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Decrease text size"
              title="Make text smaller"
            >
              <ZoomOutIcon size={28} aria-hidden="true" />
            </button>

            <button
              onClick={handleZoomIn}
              disabled={!canZoomIn}
              className="flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Increase text size"
              title="Make text bigger"
            >
              <ZoomInIcon size={28} aria-hidden="true" />
            </button>
          </div>

          {/* Quick zoom buttons */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {ZOOM_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => {
                  setZoomLevel(level);
                  applyZoom(level);
                }}
                className={`py-2 px-1 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  zoomLevel === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                aria-label={`Set text size to ${level}%`}
                aria-pressed={zoomLevel === level}
              >
                {level}%
              </button>
            ))}
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            disabled={zoomLevel === 100}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-gray-700 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Reset text size to default"
          >
            <RotateCcwIcon size={20} aria-hidden="true" />
            Reset to Default
          </button>

          {/* Help text */}
          <p className="text-sm text-gray-500 text-center mt-3">
            Your preference will be saved automatically.
          </p>
        </div>
      )}
    </div>
  );
}
