import React, { useState } from 'react';
import { NowPlayingSidebar } from './NowPlayingSidebar';
import { Clip } from './YoutubeRadioPlayer';

interface TrackInfoProps {
  title: string;
  anime: string;
  artist: string;
  opening: string;
  allClips?: Clip[];
  currentClip?: Clip;
  onSelectClip?: (clip: Clip) => void;
}

export function TrackInfo({ title, anime, artist, opening, allClips, currentClip, onSelectClip }: TrackInfoProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fallback pour le clip courant si non fourni
  const current: Clip = currentClip || { id: '', title, anime, artist, opening };

  return (
    <>
      <div
        style={{position: 'fixed', left: 32, bottom: 32, zIndex: 1000, cursor: 'pointer'}}
        className="flex flex-col items-center justify-center"
        onClick={() => setSidebarOpen(true)}
      >
        <svg
          width="500"
          height="180"
          viewBox="0 0 500 180"
          style={{ filter: "drop-shadow(10px 10px 0 #f00611) drop-shadow(0 4px 16px rgba(0,0,0,0.4))" }}
        >
          {/* Forme trapèze inclinée, fond blanc */}
          <polygon
            points="40,20 480,40 460,160 20,140"
            fill="#fff"
            stroke="#222"
            strokeWidth="10"
          />
          {/* Label vertical rouge à gauche (opening) */}
          <g>
            <rect x="38" y="38" width="32" height="104" fill="#f00611" rx="8" />
            <text
              x="54"
              y="90"
              textAnchor="middle"
              fontFamily="'Lazer84', sans-serif"
              fontSize="22"
              fill="#fff"
              transform="rotate(-90 54 90)"
              style={{letterSpacing: '0.1em', textShadow: '2px 2px 0 #000'}}
            >
              {opening.toUpperCase()}
            </text>
          </g>
          {/* Titre principal, taille auto */}
          <text
            x="110"
            y="80"
            fontFamily="'KOMIKAX_', sans-serif"
            fontWeight="bold"
            fontSize="30"
            fill="#222"
            style={{
              paintOrder: "stroke",
              stroke: "#fff",
              strokeWidth: 7,
              filter: "drop-shadow(2px 2px 0 #f00611)"
            }}
            textLength="350"
            lengthAdjust="spacingAndGlyphs"
          >
            {title}
          </text>
          {/* Anime */}
          <text
            x="110"
            y="115"
            fontFamily="'KOMIKAX_', sans-serif"
            fontWeight="bold"
            fontSize="22"
            fill="#222"
            style={{
              paintOrder: "stroke",
              stroke: "#fff",
              strokeWidth: 4
            }}
          >
            [ {anime} ]
          </text>
          {/* Artist en bas, rouge */}
          <text
            x="110"
            y="150"
            fontFamily="'Lazer84', sans-serif"
            fontWeight="bold"
            fontSize="24"
            fill="#f00611"
            style={{
              letterSpacing: 2,
              textTransform: "uppercase",
              filter: "drop-shadow(1px 1px 0 #fff)"
            }}
          >
            {artist}
          </text>
        </svg>
      </div>
      {allClips && onSelectClip && (
        <NowPlayingSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          current={current}
          all={allClips}
          onSelect={clip => {
            onSelectClip(clip);
            setSidebarOpen(false);
          }}
        />
      )}
    </>
  );
} 