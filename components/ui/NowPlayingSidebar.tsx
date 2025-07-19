import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Clip } from './YoutubeRadioPlayer';
import gsap from 'gsap';

interface NowPlayingSidebarProps {
  open: boolean;
  onClose: () => void;
  current: Clip;
  all: Clip[];
  onSelect: (clip: Clip) => void;
}

export function NowPlayingSidebar({ open, onClose, current, all, onSelect }: NowPlayingSidebarProps) {
  const [search, setSearch] = useState('');
  const [animate, setAnimate] = useState(false);
  const [clickedIdx, setClickedIdx] = useState<number | null>(null);
  const [openingFilter, setOpeningFilter] = useState<string>('');
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setClickedIdx(null);
      setOpeningFilter('');
    }
  }, [open]);

  // Liste des types d'opening uniques (hors vide)
  const openingTypes = useMemo(() => {
    const set = new Set<string>();
    all.forEach(clip => {
      if (clip.opening && clip.opening.trim()) set.add(clip.opening.trim());
    });
    return Array.from(set).sort();
  }, [all]);

  // Filtrage par search et opening
  const filtered = all.filter(clip => {
    const matchesOpening = !openingFilter || clip.opening === openingFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      clip.title.toLowerCase().includes(q) ||
      clip.artist.toLowerCase().includes(q) ||
      clip.anime.toLowerCase().includes(q) ||
      (clip.opening && clip.opening.toLowerCase().includes(q));
    return matchesOpening && matchesSearch;
  });

  // Pour alterner l'inclinaison des pancartes
  const getRotation = (idx: number) => (idx % 2 === 0 ? '-3deg' : '3deg');

  // Effet de bounce au hover - rotation comme une pancarte qui prend le vent
  const handleCardHover = (idx: number) => {
    const card = cardRefs.current[idx];
    if (card) {
      gsap.killTweensOf(card);
      const baseRotation = idx % 2 === 0 ? -3 : 3;
      gsap.to(card, {
        rotation: baseRotation + (idx % 2 === 0 ? -3 : 3),
        duration: 0.15,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(card, {
            rotation: baseRotation,
            duration: 0.2,
            ease: "elastic.out(1, 0.4)"
          });
        }
      });
    }
  };

  const handleCardLeave = (idx: number) => {
    const card = cardRefs.current[idx];
    if (card) {
      gsap.killTweensOf(card);
      const baseRotation = idx % 2 === 0 ? -3 : 3;
      gsap.to(card, {
        rotation: baseRotation,
        duration: 0.1,
        ease: "power2.out"
      });
    }
  };

  return (
    <>
      {/* Overlay pour fermer la sidebar au clic en dehors */}
      {open && (
        <div
          className="fixed inset-0 z-[1999] bg-black/30 backdrop-blur-md"
          onClick={onClose}
          aria-label="Fermer le menu"
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-[340px] z-[2000] flex flex-col items-end transition-transform duration-700 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          transform: open
            ? animate
              ? 'translateY(0)'
              : 'translateY(-100%)'
            : 'translateY(-100%)',
          transition: 'transform 0.7s cubic-bezier(.77,0,.18,1)',
        }}
        onClick={e => e.stopPropagation()} // Empêche la propagation du clic à l'overlay
      >
        {/* Bandeau noren */}
        <div className="relative w-full flex flex-col items-center" style={{zIndex:2}}>
          {/* Rideau SVG */}
          <svg width="340" height="70" viewBox="0 0 340 70" className="absolute top-0 left-0" style={{zIndex:1}}>
            <rect x="0" y="0" width="340" height="70" rx="0" fill="#f00611" stroke="#222" strokeWidth="8" />
            {/* Fentes noren */}
            <rect x="110" y="0" width="8" height="70" fill="#222" opacity="0.18" />
            <rect x="220" y="0" width="8" height="70" fill="#222" opacity="0.18" />
          </svg>
          <div className="relative flex flex-row items-center justify-between w-full px-6 pt-4 pb-2" style={{zIndex:2}}>
           
            <div className="text-white text-2xl font-extrabold tracking-widest uppercase drop-shadow" style={{fontFamily:'KOMIKAX_, sans-serif', letterSpacing:2}}>Menu</div>
            {/* Tag suspendu pour fermer */}
            <button
              className="ml-auto bg-[#f5ecd7] border-4 border-black rounded-full px-4 py-1 text-black font-bold shadow hover:bg-[#f00611] hover:text-white transition text-lg flex items-center"
              style={{fontFamily:'Lazer84, sans-serif', transform:'rotate(6deg)', boxShadow:'0 4px 0 #f00611'}}
              onClick={onClose}
            >
              <span className="mr-1">✕</span> Fermer
            </button>
          </div>
        </div>
        {/* Filtres opening */}
        {openingTypes.length > 0 && (
          <div className="w-full flex flex-row items-center justify-center gap-2 mt-2 mb-2 px-3 flex-wrap">
            <button
              className={`px-3 py-1 rounded-full border-2 border-black font-bold text-xs uppercase tracking-widest transition-all shadow ${!openingFilter ? 'bg-[#f00611] text-white scale-105' : 'bg-[#f5ecd7] text-black hover:bg-[#f00611]/90 hover:text-white'}`}
              style={{fontFamily:'KOMIKAX_, sans-serif'}}
              onClick={() => setOpeningFilter('')}
            >
              Tous
            </button>
            {openingTypes.map(type => (
              <button
                key={type}
                className={`px-3 py-1 rounded-full border-2 border-black font-bold text-xs uppercase tracking-widest transition-all shadow ${openingFilter === type ? 'bg-[#f00611] text-white scale-105' : 'bg-[#f5ecd7] text-black hover:bg-[#f00611]/90 hover:text-white'}`}
                style={{fontFamily:'KOMIKAX_, sans-serif'}}
                onClick={() => setOpeningFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
        )}
        {/* Recherche façon pancarte */}
        <div className="w-full flex flex-row items-center justify-center mt-2 mb-4">
          <div className="flex-1 bg-[#f5ecd7] border-4 border-black rounded-2xl mx-3 flex items-center px-3 py-2 shadow-lg" style={{transform:'rotate(-2deg)'}}>
            <span className="text-black text-xl mr-2">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="flex-1 bg-transparent outline-none text-black text-lg uppercase font-bold tracking-widest placeholder-black/40"
              style={{fontFamily:'KOMIKAX_, sans-serif'}}
            />
          </div>
        </div>
        {/* Liste verticale façon pancartes suspendues */}
        <div className="flex-1 w-full flex flex-col gap-6 items-end pr-4 overflow-y-auto pb-8 relative">
          {filtered.length > 0 ? (
            filtered.map((clip, idx) => {
              const isCurrent = clip.id === current.id;
              const isClicked = clickedIdx === idx;
              return (
                <div key={clip.id + '-' + idx} className="relative w-full flex flex-col items-end">
                  {/* Corde/trait */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-1 h-6 bg-black z-0" style={{borderRadius:'2px'}} />
                  {/* Pancarte */}
                  <div
                    ref={el => { cardRefs.current[idx] = el; }}
                    className={`relative w-[90%] min-h-[70px] max-h-[120px] px-5 py-4 border-4 border-black rounded-2xl shadow-xl cursor-pointer transition-all duration-200 flex flex-row items-center select-none ${isCurrent || isClicked ? 'bg-[#f00611] text-white scale-105' : 'bg-[#f5ecd7] text-black hover:bg-[#f00611]/90 hover:text-white hover:scale-102'} `}
                    style={{
                      fontFamily:'KOMIKAX_, sans-serif',
                      letterSpacing:1,
                      transform: `${isClicked ? 'scale(1.12) translateY(-6px)' : ''}`,
                      boxShadow: isCurrent || isClicked ? '0 0 0 4px #f00611' : undefined,
                      transition: 'all 0.25s cubic-bezier(.68,-0.55,.27,1.55)',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={() => handleCardHover(idx)}
                    onMouseLeave={() => handleCardLeave(idx)}
                    onClick={() => {
                      setClickedIdx(idx);
                      setTimeout(() => {
                        setClickedIdx(null);
                        onSelect(clip);
                      }, 250);
                    }}
                  >
                    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                      <span className="text-lg font-extrabold uppercase truncate w-full block" title={clip.title}>{clip.title}</span>
                      <span className="text-base font-bold truncate w-full block" style={{fontFamily:'Lazer84, sans-serif', color: isCurrent || isClicked ? '#fff' : '#f00611'}}>{clip.artist}</span>
                      <span className="text-xs italic truncate w-full block">{clip.anime}</span>
                    </div>
                    {/* Opening vertical à droite, toujours à l'intérieur */}
                    {clip.opening && (
                      <span
                        className="text-xs font-bold ml-3 select-none shrink-0 max-w-[24px] min-w-[16px] overflow-hidden"
                        style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          fontFamily: 'Lazer84, sans-serif',
                          color: isCurrent || isClicked ? '#fff' : '#f00611',
                          letterSpacing: 2,
                          textTransform: 'uppercase',
                          minHeight: '48px',
                          lineHeight: 1.1,
                          filter: isCurrent || isClicked ? 'drop-shadow(0 0 2px #f00611)' : 'drop-shadow(0 0 2px #fff)',
                          background: 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          maxHeight: '80px',
                          boxSizing: 'border-box',
                          transition: 'none',
                        }}
                      >
                        {clip.opening}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : null}
        </div>
        <style jsx global>{`
          .scrollbar-thin::-webkit-scrollbar { width: 6px; }
          .scrollbar-thin::-webkit-scrollbar-thumb { background: #fde68a; border-radius: 6px; }
        `}</style>
      </div>
    </>
  );
} 