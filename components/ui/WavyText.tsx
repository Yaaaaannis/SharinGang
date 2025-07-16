import React from "react";

export function WavyText({ text }: { text: string }) {
  return (
    <svg width="500" height="160" viewBox="0 0 500 150" className="mx-auto block">
      <defs>
        <pattern id="paper-texture" patternUnits="userSpaceOnUse" width="700" height="200">
          <image href="/brownpaper.jpg" x="-100" y="-20" width="1000" height="500" />
        </pattern>
        <path id="wave" d="M 40 120 Q 250 40 460 120" />
      </defs>
      <text fontSize="64" fontFamily="'KOMIKAX_', sans-serif" fill="url(#paper-texture)" fontWeight="bold" style={{
        textShadow: '4px 4px 0 #f00611, 4px 4px 6px rgba(0,0,0,0.7)'
      }}>
        <textPath href="#wave" startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  );
} 