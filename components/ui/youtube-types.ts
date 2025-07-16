export interface Player {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  setPlaybackQuality: (quality: string) => void;
  loadVideoById: (id: string) => void;
}

export interface PlayerEvent {
  target: Player;
  data: number;
} 