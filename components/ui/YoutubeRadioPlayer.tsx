"use client"

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { YoutubeBackground } from './YoutubeBackground';
import { PlayerControls } from './PlayerControls';

import { TrackInfo } from './TrackInfo';
import { LoaderOverlay } from './LoaderOverlay';
import { TransitionOverlay } from './TransitionOverlay';
import { useCurrentTrack } from "./CurrentTrackContext";
import { NowPlayingSection } from '../search/NowPlayingSection';

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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(() => getRandomIndex(videos.length, -1));
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

  // Surveille le temps restant et passe à la suivante 5 secondes avant la fin
  useEffect(() => {
    if (!player || isLoading) return;

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
        setHasTriggeredNext(true);
        handleNext();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [player, isLoading, hasTriggeredNext]);

  // Remet à zéro le flag à chaque nouvelle vidéo
  useEffect(() => {
    setHasTriggeredNext(false);
  }, [currentVideoIndex]);

  // Surveille le temps restant et passe à la suivante 5 secondes avant la fin
  useEffect(() => {
    setTrack({
      title: currentVideo.titre || currentVideo.title || '',
      anime: currentVideo.Anime?.original_name || currentVideo.anime || '',
      artist: currentVideo.Artist?.name || currentVideo.artist || '',
      opening: currentVideo.opening || (currentVideo.type === 'opening' && currentVideo.type_number ? `Opening ${currentVideo.type_number}` : currentVideo.type || ''),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoIndex]);

  // YoutubeBackground callbacks
  const handleReady = (event: PlayerEvent) => {
    event.target.setPlaybackQuality('hd1080');
    setPlayer(event.target);
  };
  const handleStateChange = (event: PlayerEvent) => {
    if (event.data === 0) {
      handleNext();
    }
  };

  
  const handleStart = () => {
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

  const handleNext = () => {
    if (player && !isTransitioning) {
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



  return (
    <div className="relative min-h-screen">
      <TransitionOverlay isTransitioning={isTransitioning} />
      <YoutubeBackground
        videoId={currentVideo.id}
        options={{
          autoplay: 1,
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
        <PlayerControls
          isPlaying={isPlaying}
          isTransitioning={isTransitioning}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      <div
        onMouseEnter={() => setIsVolumeControlVisible(true)}
        onMouseLeave={() => setIsVolumeControlVisible(false)}
      >
      
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <TrackInfo
        
          title={currentVideo.titre || currentVideo.title || ''}
          anime={currentVideo.Anime?.original_name || currentVideo.anime || ''}
          artist={currentVideo.Artist?.name || currentVideo.artist || ''}
          opening={currentVideo.opening || (currentVideo.type === 'opening' && currentVideo.type_number ? `Opening ${currentVideo.type_number}` : currentVideo.type || '')}
        />
      </div>
      {/* NowPlayingSection en bas à gauche */}
      {!isLoading && (
        <NowPlayingSection
          current={currentVideo}
          all={videos}
          onSelect={(clip) => {
            const idx = videos.findIndex(v => v.id === clip.id);
            if (idx !== -1 && idx !== currentVideoIndex) {
              setCurrentVideoIndex(idx);
              player?.loadVideoById(clip.id);
              setIsPlaying(true);
            }
          }}
        />
      )}
    </div>
  );
} 