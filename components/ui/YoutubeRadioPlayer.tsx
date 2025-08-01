"use client"

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { YoutubeBackground } from './YoutubeBackground';
import { PlayerControls } from './PlayerControls';

import { TrackInfo } from './TrackInfo';
import { LoaderOverlay } from './LoaderOverlay';
import { TransitionOverlay } from './TransitionOverlay';
import { useCurrentTrack } from "./CurrentTrackContext";


export type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  setPlaybackQuality: (quality: string) => void;
  loadVideoById: (id: string) => void;
};
export type PlayerEvent = {
  target: YTPlayer;
  data: number;
};
  
interface YTNamespace {
  Player: new (elementId: string, options: object) => YTPlayer;
}
declare global {
  interface Window {
    YT: YTNamespace;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface Clip {
  id: string;
  title: string;
  artist: string;
  anime: string;
  opening: string;
}

interface YoutubeRadioPlayerProps {
  videos: Clip[];
}

// Ajout de la fonction utilitaire pour obtenir un index aléatoire différent de l'actuel
function getRandomIndex(length: number, exclude: number): number {
  let idx = exclude;
  while (idx === exclude && length > 1) {
    idx = Math.floor(Math.random() * length);
  }
  return idx;
}

export function YoutubeRadioPlayer({ videos }: YoutubeRadioPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [player, setPlayer] = useState<YTPlayer | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isVolumeControlVisible, setIsVolumeControlVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  // Remplace l'initialisation de currentVideoIndex pour démarrer sur un clip random
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  // Ajout d'un type pour supporter à la fois Clip et les objets Supabase
  type AnyVideo = Clip & {
    titre?: string;
    Anime?: { original_name?: string };
    Artist?: { name?: string };
    type?: string;
    type_number?: number;
    opening?: string;
  };
  const currentVideo = videos[currentVideoIndex] as AnyVideo;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const artistRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [dots, setDots] = useState('');
  const [hasTriggeredNext, setHasTriggeredNext] = useState(false);
  const { setTrack } = useCurrentTrack();
  const stuckAtEndCount = useRef(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Timeout pour skip si jamais Playing
  const skipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasPlayedRef = useRef(false);

  // Surveille le temps restant et passe à la suivante 5 secondes avant la fin
  useEffect(() => {
    if (!player || isLoading) {
      console.log('[AutoNext] Pas de player ou isLoading', { player, isLoading });
      return;
    }

    const interval = setInterval(() => {
      // @ts-expect-error: getDuration n'est pas typé dans YTPlayer mais existe sur l'instance réelle
      const duration = player.getDuration?.();
      // @ts-expect-error: getCurrentTime n'est pas typé dans YTPlayer mais existe sur l'instance réelle
      const currentTime = player.getCurrentTime?.();
      if (
        duration &&
        currentTime !== undefined &&
        duration - currentTime <= 5 &&
        !hasTriggeredNext
      ) {
        console.log('[AutoNext] Passage à la suivante');
        setHasTriggeredNext(true);
        handleNext();
      }
      // Sécurité : si bloqué à la fin trop longtemps, on force le next
      if (
        duration &&
        currentTime !== undefined &&
        Math.abs(duration - currentTime) < 0.1 // tolérance flottante
      ) {
        stuckAtEndCount.current += 1;
        if (stuckAtEndCount.current > 5) {
          console.log('[AutoNext] Sécurité : vidéo bloquée à la fin, on force le next');
          setHasTriggeredNext(true);
          handleNext();
          stuckAtEndCount.current = 0;
        }
      } else {
        stuckAtEndCount.current = 0;
      }
    }, 500);

    return () => clearInterval(interval);
  }, [player, isLoading, hasTriggeredNext]);

  // Remet à zéro le flag à chaque nouvelle vidéo
  useEffect(() => {
    console.log('[AutoNext] Reset hasTriggeredNext pour index', currentVideoIndex);
    setHasTriggeredNext(false);
    stuckAtEndCount.current = 0;
  }, [currentVideoIndex]);

  // Surveille le temps restant et passe à la suivante 5 secondes avant la fin
  useEffect(() => {
    console.log('[Track] Clip joué :', currentVideo);
    setTrack({
      title: currentVideo.titre || currentVideo.title || '',
      anime: currentVideo.Anime?.original_name || currentVideo.anime || '',
      artist: currentVideo.Artist?.name || currentVideo.artist || '',
      opening: currentVideo.opening || (currentVideo.type === 'opening' && currentVideo.type_number ? `Opening ${currentVideo.type_number}` : currentVideo.type || ''),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoIndex]);

  // Timeout pour skip si jamais Playing
  useEffect(() => {
    hasPlayedRef.current = false;
    if (skipTimeoutRef.current) {
      clearTimeout(skipTimeoutRef.current);
    }
    skipTimeoutRef.current = setTimeout(() => {
      if (!hasPlayedRef.current) {
        console.warn('[YT] Timeout: vidéo jamais passée à Playing, on skip');
        handleNext(true);
      }
    }, 3000);
    return () => {
      if (skipTimeoutRef.current) {
        clearTimeout(skipTimeoutRef.current);
        skipTimeoutRef.current = null;
      }
    };
  }, [currentVideoIndex]);

  // YoutubeBackground callbacks
  const handleReady = (event: PlayerEvent) => {
    console.log('[YT] handleReady', event);
    event.target.setPlaybackQuality('hd1080');
    setPlayer(event.target);
  };
  const handleStateChange = (event: PlayerEvent) => {
    console.log('[YT] handleStateChange', event.data);
    // Si Playing, on annule le timeout
    if (event.data === 1) {
      hasPlayedRef.current = true;
      if (skipTimeoutRef.current) {
        clearTimeout(skipTimeoutRef.current);
        skipTimeoutRef.current = null;
      }
    }
    if (event.data === 0) {
      console.log('[YT] handleStateChange: Fin de vidéo, passage à la suivante (mécanisme natif, fonctionne même onglet inactif)');
      handleNext();
    }
    // Optionnel : logs pour d'autres états
    if (event.data === -1) {
      console.log('[YT] handleStateChange: Unstarted');
    }
    if (event.data === 3) {
      console.log('[YT] handleStateChange: Buffering');
    }
  };

  const handleStart = () => {
    console.log('[YT] handleStart');
    if (player) {
      player.playVideo();
      setIsLoading(false);
    }
  };

  

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = (force = false) => {
    console.log('[YT] handleNext called', { force });
    if (player && (!isTransitioning || force)) {
      setIsTransitioning(true);
      setTimeout(() => {
        player.stopVideo();
        setCurrentVideoIndex((prevIndex) => {
          const newIndex = getRandomIndex(videos.length, prevIndex);
          player.loadVideoById(videos[newIndex].id);
          return newIndex;
        });
        setIsPlaying(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1000);
      }, 1000);
    }
  };

  const handlePrev = () => {
    if (player && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        player.stopVideo();
        setCurrentVideoIndex((prevIndex) => {
          // Pour un comportement random aussi sur prev, dé-commente la ligne suivante :
          // const newIndex = getRandomIndex(videos.length, prevIndex);
          // return newIndex;
          // Sinon, laisse le comportement séquentiel :
          const newIndex = prevIndex === 0 ? videos.length - 1 : prevIndex - 1;
          player.loadVideoById(videos[newIndex].id);
          return newIndex;
        });
        setIsPlaying(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1000);
      }, 1000);
    }
  };

  // Ajout du log avant le render JSX
  console.log('[Render] isLoading:', isLoading, 'currentVideoIndex:', currentVideoIndex);

  return (
    <div 
      className="relative min-h-screen"
      role="application"
      aria-label="Radio anime SharinGang - Lecteur de musiques d'anime"
    >
      <TransitionOverlay isTransitioning={isTransitioning} />
      <YoutubeBackground
        videoId={currentVideo.id}
        options={{
          autoplay: isLoading ? 0 : 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          loop: 0,
          playsinline: 1,
          vq: 'hd1080',
        }}
        onReady={handleReady}
        onStateChange={handleStateChange}
      />
      {isLoading && <LoaderOverlay onStart={handleStart} />}
      {!isLoading && (
        <div
          className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 transition-all duration-500 ${sidebarOpen ? 'blur-md' : ''} ${isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          role="toolbar"
          aria-label="Contrôles du lecteur"
        >
          <PlayerControls
            isPlaying={isPlaying}
            isTransitioning={isTransitioning}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </div>
      )}
      <div 
        className="relative z-10 min-h-screen flex items-center justify-center"
        role="main"
        aria-label="Informations sur la piste en cours"
      >
        <TrackInfo
          title={currentVideo.titre || currentVideo.title || ''}
          anime={currentVideo.Anime?.original_name || currentVideo.anime || ''}
          artist={currentVideo.Artist?.name || currentVideo.artist || ''}
          opening={currentVideo.opening || (currentVideo.type === 'opening' && currentVideo.type_number ? `Opening ${currentVideo.type_number}` : currentVideo.type || '')}
          allClips={videos}
          currentClip={currentVideo}
          onSelectClip={clip => {
            if (player) {
              setCurrentVideoIndex(videos.findIndex(v => v.id === clip.id));
              player.loadVideoById(clip.id);
              setIsPlaying(true);
            }
          }}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
      {/* NowPlayingSidebar en bas à gauche */}
     
    </div>
  );
} 