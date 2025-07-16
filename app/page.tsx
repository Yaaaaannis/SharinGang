import { YoutubeRadioPlayer } from "@/components/ui/YoutubeRadioPlayer";
import { fetchVideosWithAnimeAndArtist } from "@/lib/supabaseClient";

interface SupabaseVideo {
  youtube_id: string;
  titre: string;
  type: string;
  type_number?: number;
  artist?: { name: string } | null;
  anime?: { original_name: string } | null;
}

export default async function Home() {
  const videosRaw = await fetchVideosWithAnimeAndArtist();
  // Adapter les données pour correspondre à l'interface attendue par YoutubeRadioPlayer
  const videos = (videosRaw || []).map((v: SupabaseVideo) => ({
    id: v.youtube_id,
    title: v.titre,
    artist: v.artist?.name || '',
    anime: v.anime?.original_name || '',
    opening: v.type === 'opening' && v.type_number ? `Opening ${v.type_number}` : v.type,
  }));
  return <YoutubeRadioPlayer videos={videos} />;
}
