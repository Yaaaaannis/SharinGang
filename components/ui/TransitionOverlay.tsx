interface TransitionOverlayProps {
  isTransitioning: boolean;
}

export function TransitionOverlay({ isTransitioning }: TransitionOverlayProps) {
  return (
    <div className={`fixed inset-0 bg-black z-40 pointer-events-none transition-opacity duration-1000 ${
      isTransitioning ? 'opacity-100' : 'opacity-0'
    }`}></div>
  );
} 