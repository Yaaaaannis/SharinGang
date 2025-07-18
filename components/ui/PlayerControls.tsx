interface PlayerControlsProps {
  isPlaying: boolean;
  isTransitioning: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function PlayerControls({ isPlaying, isTransitioning, onPlayPause, onNext, onPrev }: PlayerControlsProps) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8">
      {/* Previous */}
      <button
        onClick={onPrev}
        className="w-20 h-20 flex items-center justify-center rounded-full shadow-lg bg-white border-4 border-black active:scale-95 active:translate-y-1 transition-all duration-100 outline-none focus:ring-2 focus:ring-[#f00611]"
        disabled={isTransitioning}
        aria-label="Précédent"
      >
        <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-black text-white font-komikax text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)] border-2 border-white" style={{letterSpacing: '0.1em', textShadow: '2px 2px 0 #000, 0 0 6px #000'}}>
          PREV
        </span>
      </button>
      {/* Play/Pause */}
      <button
        onClick={onPlayPause}
        className="w-24 h-24 flex items-center justify-center rounded-full shadow-lg bg-white border-4 border-black active:scale-95 active:translate-y-1 transition-all duration-100 outline-none focus:ring-2 focus:ring-[#f00611]"
        disabled={isTransitioning}
        aria-label={isPlaying ? "Pause" : "Lecture"}
      >
        <span className="relative flex items-center justify-center w-20 h-20 rounded-full bg-black text-white font-komikax text-3xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)] border-2 border-white" style={{letterSpacing: '0.1em', textShadow: '2px 2px 0 #000, 0 0 6px #000'}}>
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </span>
      </button>
      {/* Next */}
      <button
        onClick={onNext}
        className="w-20 h-20 flex items-center justify-center rounded-full shadow-lg bg-white border-4 border-black active:scale-95 active:translate-y-1 transition-all duration-100 outline-none focus:ring-2 focus:ring-[#f00611]"
        disabled={isTransitioning}
        aria-label="Suivant"
      >
        <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-black text-white font-komikax text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)] border-2 border-white" style={{letterSpacing: '0.1em', textShadow: '2px 2px 0 #000, 0 0 6px #000'}}>
          NEXT
        </span>
      </button>
    </div>
  );
} 