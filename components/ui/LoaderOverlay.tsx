import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

interface LoaderOverlayProps {
  onStart: () => void;
}

export function LoaderOverlay({ onStart }: LoaderOverlayProps) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Animation d'entrée simple
    gsap.fromTo('.loader-title', 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    gsap.fromTo('.loader-button', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
    );
  }, []);

  const handleButtonHover = () => {
    setIsHovered(true);
  };

  const handleButtonLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loader-title"
      aria-describedby="loader-description"
    >
      {/* Fond avec texture */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/brownpaper.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'contrast(1.2) brightness(0.8)'
        }}
        aria-hidden="true"
      />
      
      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Titre principal avec style pancarte */}
        <div className="relative mb-12">
          {/* Pancarte de fond */}
          <div className="bg-[#f5ecd7] border-4 border-black rounded-2xl px-8 py-6 shadow-2xl" style={{transform: 'rotate(-1deg)'}}>
            <div 
              id="loader-title"
              className="loader-title text-6xl font-komikax uppercase text-center"
              role="heading"
              aria-level={1}
            >
              <span className="text-black drop-shadow-[2px_2px_0_#f00611]">Sharin</span>
              <span className="text-[#f00611] drop-shadow-[2px_2px_0_#000]">Gang</span>
            </div>
          </div>
          
          {/* Corde suspendue */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-1 h-8 bg-black rounded-full" aria-hidden="true" />
          
          {/* Petites pancartes décoratives */}
          <div className="absolute -top-16 -left-8 w-6 h-4 bg-[#f00611] border-2 border-black rounded rotate-12" aria-hidden="true" />
          <div className="absolute -top-12 -right-6 w-4 h-3 bg-[#f5ecd7] border-2 border-black rounded -rotate-6" aria-hidden="true" />
        </div>

        {/* Description */}
        <div 
          id="loader-description"
          className="sr-only"
        >
          Radio anime SharinGang - Écoutez les meilleures openings et endings d&apos;anime japonais
        </div>

        {/* Bouton de démarrage */}
        <div className="relative">
          {/* Corde du bouton */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-1 h-6 bg-black rounded-full" aria-hidden="true" />
          
          <button
            className="loader-button relative px-12 py-6 bg-[#f5ecd7] border-4 border-black rounded-2xl shadow-xl font-lazer84 text-2xl uppercase text-black transition-all duration-200 hover:bg-[#f00611] hover:text-white cursor-pointer"
            style={{
              letterSpacing: '0.1em',
              textShadow: isHovered ? '2px 2px 0 #000' : '1px 1px 0 #f00611',
              transform: 'rotate(1deg)',
              boxShadow: isHovered ? '0 8px 0 #f00611, 0 4px 8px rgba(0,0,0,0.3)' : '0 4px 0 #f00611, 0 2px 4px rgba(0,0,0,0.2)'
            }}
            onClick={onStart}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            aria-label="Commencer à écouter la radio anime"
          >
            Appuyez pour commencer
          </button>
        </div>

        {/* Éléments décoratifs */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-20 w-8 h-8 bg-[#f00611] border-2 border-black rounded-full opacity-60" style={{transform: 'rotate(15deg)'}} aria-hidden="true" />
        <div className="absolute top-1/3 -right-16 w-6 h-6 bg-[#f5ecd7] border-2 border-black rounded-full opacity-60" style={{transform: 'rotate(-10deg)'}} aria-hidden="true" />
        <div className="absolute bottom-1/3 -left-12 w-4 h-4 bg-[#f00611] border-2 border-black rounded-full opacity-40" style={{transform: 'rotate(25deg)'}} aria-hidden="true" />
      </div>

      {/* Animation de particules flottantes */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#f00611] rounded-full opacity-30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
} 