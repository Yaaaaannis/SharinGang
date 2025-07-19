import { YoutubeRadioPlayer } from "@/components/ui/YoutubeRadioPlayer";
import { fetchVideosWithAnimeAndArtist } from "@/lib/supabaseClient";
import { Metadata } from 'next';

interface SupabaseVideo {
  ytid: string;
  title: string;
  type: string;
  type_number?: number;
  artistables?: { artists?: { name: string } | null }[] | null;
  video_anime?: { animes?: { title_fr: string } | null }[] | null;
  genrables?: { genres?: { name: string } | null }[] | null;
}

export const metadata: Metadata = {
  title: 'SharinGang - Radio Anime Openings & Endings',
  description: 'Écoutez en streaming les meilleures openings et endings d\'anime japonais. Radio gratuite avec une sélection unique de musiques d\'anime.',
  keywords: 'anime, openings, endings, musique japonaise, streaming, radio, j-pop, j-rock, ost anime',
  authors: [{ name: 'SharinGang' }],
  creator: 'SharinGang',
  publisher: 'SharinGang',
  robots: 'index, follow',
  openGraph: {
    title: 'SharinGang - Radio Anime Openings & Endings',
    description: 'Écoutez en streaming les meilleures openings et endings d\'anime japonais. Radio gratuite avec une sélection unique de musiques d\'anime.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'SharinGang',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SharinGang - Radio Anime',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SharinGang - Radio Anime Openings & Endings',
    description: 'Écoutez en streaming les meilleures openings et endings d\'anime japonais.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://sharingang.com',
  },
};

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

  return (
    <main>
      <YoutubeRadioPlayer videos={videos} />
    </main>
  );
}
