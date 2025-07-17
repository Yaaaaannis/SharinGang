import { YoutubeRadioPlayer } from "@/components/ui/YoutubeRadioPlayer";
import { fetchVideosWithAnimeAndArtist } from "@/lib/supabaseClient";

interface SupabaseVideo {
  ytid: string;
  title: string;
  type: string;
  type_number?: number;
  artistables?: { artists?: { name: string } | null }[] | null;
  video_anime?: { animes?: { title_fr: string } | null }[] | null;
  genrables?: { genres?: { name: string } | null }[] | null;
}

export default async function Home() {
  const videosRaw = await fetchVideosWithAnimeAndArtist();
  const videos = (videosRaw || [])
    .filter((v: SupabaseVideo) => v.ytid && v.ytid.length === 11)
    .map((v: SupabaseVideo) => ({
      id: v.ytid,
      title: v.title,
      artist:
        v.artistables && v.artistables.length > 0
          ? v.artistables
              .map(a => a.artists?.name)
              .filter(Boolean)
              .join(', ')
          : '',
      anime:
        v.video_anime &&
        v.video_anime.length > 0 &&
        v.video_anime[0].animes
          ? v.video_anime[0].animes.title_fr
          : '',
      genre:
        v.genrables &&
        v.genrables.length > 0 &&
        v.genrables[0].genres
          ? v.genrables[0].genres.name
          : '',
      opening:
        v.type === 'opening' && v.type_number
          ? `Opening ${v.type_number}`
          : v.type,
    }));
  return <YoutubeRadioPlayer videos={videos} />;
}
