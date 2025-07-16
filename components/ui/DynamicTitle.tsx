"use client";
import { useCurrentTrack } from "./CurrentTrackContext";
import { useEffect } from "react";

export function DynamicTitle() {
  const { track } = useCurrentTrack();

  useEffect(() => {
    document.title = track
      ? `${track.title} (${track.anime})`
      : "SharinGang";
  }, [track]);

  return null; // Ce composant ne rend rien dans le DOM
} 