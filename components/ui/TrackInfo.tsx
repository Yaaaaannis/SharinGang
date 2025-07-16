import React from 'react';
import { WavyText } from "@/components/ui/WavyText";

// Props adaptées pour recevoir les données issues de la db (déjà utilisées avant)
interface TrackInfoProps {
  title: string; // titre de la vidéo (v.titre)
  anime: string; // nom de l'anime (v.Anime.original_name)
  artist: string; // nom de l'artiste (v.Artist.name)
  opening: string; // ex: 'Opening 1' ou 'ending', etc.
}

export function TrackInfo({ title, anime, artist, opening }: TrackInfoProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      {/* Badge opening style Paiheme */}
      <svg width="180" height="60" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
        <defs>
          <filter id="rough" x="0" y="0" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" result="turb"/>
            <feDisplacementMap in2="turb" in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        <rect
          x="4"
          y="4"
          width="172"
          height="52"
          rx="26"
          fill="#f00611"
          stroke="#111"
          strokeWidth="6"
          filter="url(#rough)"
        />
        <text
          x="90"
          y="38"
          textAnchor="middle"
          fontFamily="'Lazer84', sans-serif"
          fontSize="20"
          fill="#fff"
          style={{letterSpacing: '0.1em', textShadow: '2px 2px 0 #000, 0 0 6px #000'}}
        >
          {opening}
        </text>
      </svg>
      {/* Titre en vague */}
      <WavyText text={title} />
      <div className="text-white text-xl text-center mb-1 font-komikax">[ {anime} ]</div>
      <div className="text-white text-2xl text-center  font-lazer84">{artist}</div>
    </div>
  );
} 