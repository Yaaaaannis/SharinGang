"use client";
import { CurrentTrackProvider } from "@/components/ui/CurrentTrackContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <CurrentTrackProvider>{children}</CurrentTrackProvider>;
} 