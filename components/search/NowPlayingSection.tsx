import React, { useState } from 'react';
import { Clip } from '../ui/YoutubeRadioPlayer';
import { SearchBar } from './SearchBar';

interface NowPlayingSectionProps {
  current: Clip;
  all: Clip[];
  onSelect: (clip: Clip) => void;
}

export function NowPlayingSection({ current, all, onSelect }: NowPlayingSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = !search.trim()
    ? all
    : all.filter(clip => {
        const q = search.trim().toLowerCase();
        return (
          clip.title.toLowerCase().includes(q) ||
          clip.artist.toLowerCase().includes(q) ||
          clip.anime.toLowerCase().includes(q) ||
          (clip.opening && clip.opening.toLowerCase().includes(q))
        );
      });

  return (
    <div
      className={`fixed bottom-0 left-0 z-50 transition-all duration-500 flex flex-col ${expanded ? 'h-2/3 w-80' : 'h-24 w-80'} rounded-tr-2xl border-t-4 border-b-4 border-l-4 border-r-8 border-black shadow-2xl overflow-hidden bg-repeat bg-[#f5ecd7]`}
    >
      {/* Overlay pour refermer en cliquant à côté, seulement en expanded */}
      {expanded && (
        <div
          className="fixed inset-0 z-40 "
          onClick={() => setExpanded(false)}
          style={{ background: 'transparent' }}
        />
      )}
      <div className="relative z-50 flex-1 flex flex-col h-full" onClick={!expanded ? () => setExpanded(true) : undefined}>
        {expanded ? (
          <>
            {/* Header sticky rouge, cliquable pour refermer */}
            <div
              className="relative p-4 flex flex-col justify-center bg-red-700 border-b-4 border-black sticky top-0 z-10 cursor-pointer select-none"
              onClick={() => setExpanded(false)}
            >
              <div className="flex flex-col items-center w-full gap-2">
                <span className="text-white font-extrabold text-xl uppercase tracking-widest drop-shadow text-center w-full">{current.title}</span>
              </div>
              <div className="text-white font-bold text-base uppercase leading-tight drop-shadow text-center w-full">{current.artist} {current.opening ? `- ${current.opening}` : ''}</div>
              <div className="text-white text-xs italic leading-tight drop-shadow text-center w-full">{current.anime}</div>
            </div>
            {/* SearchBar sticky sous le header */}
            <div className="sticky top-[72px] z-10 bg-[#f5ecd7]/95 px-2 pt-2 pb-1 border-b-2 border-black/10">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Rechercher un clip..."
              />
            </div>
            {filtered.length > 0 ? (
              <div className="overflow-y-auto bg-[#f5ecd7]/95 flex-1 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {filtered.map((clip, idx) => (
                  <div
                    key={clip.id + '-' + idx}
                    className={`p-3 border-b-2 border-black/20 hover:bg-red-100/60 transition ${clip.id === current.id ? 'bg-yellow-200 font-extrabold border-l-8 border-red-700 border-dashed' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(clip);
                      setExpanded(false);
                    }}
                    style={{
                      borderBottomStyle: 'dashed',
                      ...(clip.id === current.id ? { borderLeftStyle: 'solid' } : {})
                    }}
                  >
                    <div className="truncate text-black font-bold uppercase text-base text-center w-full">{clip.title}</div>
                    <div className="text-xs text-gray-700 truncate uppercase text-center w-full">{clip.artist} {clip.opening ? `- ${clip.opening}` : ''}</div>
                    <div className="text-xs text-gray-500 truncate italic text-center w-full">{clip.anime}</div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="p-4 text-center text-gray-400 italic">Aucun résultat</div>
                )}
                <style jsx>{`
                  .scrollbar-none::-webkit-scrollbar { display: none; }
                `}</style>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-400 italic">Aucun résultat</div>
            )}
          </>
        ) : (
          <div className="relative p-2 flex flex-col items-center justify-center h-full gap-1 bg-[#f5ecd7]/90">
            <div className="flex flex-col items-center w-full gap-2">
              <span className="font-extrabold text-base uppercase tracking-widest text-black drop-shadow text-center w-full" style={{lineHeight: '1.1', fontSize: '1rem'}}>{current.title}</span>
            </div>
            <div className="text-sm text-gray-800 truncate leading-tight font-bold uppercase text-center w-full" style={{fontSize: '0.85rem'}}>{current.artist} {current.opening ? `- ${current.opening}` : ''}</div>
            <div className="text-xs text-gray-600 truncate leading-tight italic text-center w-full" style={{fontSize: '0.8rem'}}>{current.anime}</div>
          </div>
        )}
      </div>
    </div>
  );
} 