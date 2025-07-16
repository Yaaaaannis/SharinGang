import React from 'react';

interface LoaderOverlayProps {
  onStart: () => void;
}

export function LoaderOverlay({ onStart }: LoaderOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80">
      <div
        className="mb-10 text-5xl font-lazer84 uppercase text-white"
        style={{
          textShadow: '3px 3px 0 #f00611, 0 0 10px #000',
          letterSpacing: '0.12em',
          filter: 'drop-shadow(0 0 8px #000)',
        }}
      >
        SharinGang
      </div>
      <button
        onClick={onStart}
        className="relative px-10 py-4 rounded-full font-lazer84 text-2xl uppercase text-white shadow-lg border-4 border-black bg-[#f00611] transition-transform duration-200 hover:scale-105 hover:bg-red-700"
        style={{
          textShadow: '2px 2px 0 #000, 0 0 6px #000',
          letterSpacing: '0.1em',
          filter: 'drop-shadow(0 0 8px #000)',
        }}
      >
        Appuyez pour commencer
      </button>
    </div>
  );
} 