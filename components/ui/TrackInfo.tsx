import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
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
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function TrackInfo({ title, anime, artist, opening, allClips, currentClip, onSelectClip, sidebarOpen, setSidebarOpen }: TrackInfoProps) {
  // Ajout pour éviter l'hydratation côté serveur
  const [isClient, setIsClient] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Nettoyage du timeout à l'unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Apparition auto à chaque changement de musique
  useEffect(() => {
    if (!isClient) return;
    showPanel();
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, anime, artist, opening, isClient]);

  // Early return après tous les hooks
  if (!isClient) return null;

  // Fallback pour le clip courant si non fourni
  const current: Clip = currentClip || { id: '', title, anime, artist, opening };

  // Centralise l'animation d'apparition ET le timeout de disparition
  const showPanel = () => {
    setVisible(true);
    if (infoRef.current) {
      gsap.killTweensOf(infoRef.current);
      gsap.set(infoRef.current, { opacity: 1, y: 0 });
      gsap.to(infoRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      hidePanel();
    }, 3000);
  };
  // Centralise l'animation de disparition
  const hidePanel = () => {
    if (infoRef.current) {
      gsap.killTweensOf(infoRef.current);
      gsap.to(infoRef.current, { opacity: 0, y: 40, duration: 0.6, ease: 'power2.in', onComplete: () => setVisible(false) });
    } else {
      setVisible(false);
    }
  };

  // Affiche TrackInfo au survol de la zone centrale (et relance le timeout)
  const handleMouseEnter = () => {
    showPanel();
  };
  // On ne fait rien de spécial au mouseleave
  const handleMouseLeave = () => {};

  return (
    <>
      {/* Zone centrale invisible pour le survol */}
      <div
        className="fixed z-[999] pointer-events-auto bg-transparent"
        style={{
          top: '50%',
          left: '50%',
          width: '90vw',
          maxWidth: 520,
          height: '38vw',
          maxHeight: 200,
          minHeight: 120,
          transform: 'translate(-50%, -50%)',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {visible && (
          <div
            ref={infoRef}
            style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer'}}
            className="flex flex-col items-center justify-center"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 500 180"
              style={{ maxWidth: '500px', maxHeight: '180px', width: '100%', height: '100%', filter: "drop-shadow(10px 10px 0 #f00611) drop-shadow(0 4px 16px rgba(0,0,0,0.4))" }}
            >
              {/* Forme trapèze inclinée, fond blanc */}
              <polygon
                points="40,20 480,40 460,160 20,140"
                fill="#fff"
                stroke="#222"
                strokeWidth="10"
              />
              {/* Label vertical rouge à gauche (opening) */}
              <g transform="rotate(20 54 90)">
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
        )}
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