import { createContext, useContext, useState } from "react";

export type TrackInfo = {
  title: string;
  anime: string;
  artist: string;
  opening: string;
};

const CurrentTrackContext = createContext<{
  track: TrackInfo | null;
  setTrack: (track: TrackInfo) => void;
}>({
  track: null,
  setTrack: () => {},
});

export function useCurrentTrack() {
  return useContext(CurrentTrackContext);
}

export function CurrentTrackProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrack] = useState<TrackInfo | null>(null);
  return (
    <CurrentTrackContext.Provider value={{ track, setTrack }}>
      {children}
    </CurrentTrackContext.Provider>
  );
} 