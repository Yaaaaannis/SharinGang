"use client"
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { YTPlayer, PlayerEvent } from './YoutubeRadioPlayer';

interface YoutubeBackgroundProps {
  videoId: string;
  options: object;
  onReady: (event: PlayerEvent) => void;
  onStateChange: (event: PlayerEvent) => void;
}

export const YoutubeBackground = forwardRef<YTPlayer | null, YoutubeBackgroundProps>(
  ({ videoId, options, onReady, onStateChange }, ref) => {
    const playerRef = useRef<YTPlayer | null>(null);

    useImperativeHandle(ref, () => playerRef.current as YTPlayer);

    // Wrapper pour intercepter les events d'état
    const handleStateChange = (event: PlayerEvent) => {
      // Codes d'état d'erreur potentiels :
      // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
      // Codes d'erreur (voir doc YouTube) : 2, 5, 100, 101, 150
      if (event.data === -1 || event.data === 0 || event.data === 2 || event.data === 5) {
        // Pas une erreur, ne rien faire de spécial
      }
      // Si le player expose un getPlayerState ou getError, on peut aussi l'utiliser ici
      // Mais on log tout event potentiellement problématique
      if (event.data === 100 || event.data === 101 || event.data === 150) {
        console.error("YouTube video unavailable event:", event);
      }
      // Toujours forward l'event à la prop d'origine
      onStateChange(event);
    };

    // Crée le player une seule fois
    useEffect(() => {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);

      (window as Window).onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId,
          playerVars: options,
          events: {
            onReady,
            onStateChange: handleStateChange,
          },
        });
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // plus de dépendance sur videoId

    // Quand videoId change, charge la nouvelle vidéo si le player existe déjà
    useEffect(() => {
      if (!videoId || videoId.length !== 11) {
        console.error("Invalid YouTube video ID:", videoId);
        return;
      }
      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        playerRef.current.loadVideoById(videoId);
      }
    }, [videoId]);

    return (
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="relative w-[140%] h-[140%] -left-[20%] -top-[20%]">
          <div id="youtube-player" className="absolute w-full h-full"></div>
        </div>
        {/* Overlay halftone */}
        <div className="pointer-events-none fixed inset-0 w-full h-full z-10" style={{opacity:0.02}}>
          <img src="/gif.gif" alt="halftone effect" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }
); 

YoutubeBackground.displayName = 'YoutubeBackground';