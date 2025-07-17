import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction utilitaire pour fetch toutes les vidéos enrichies
export async function fetchVideosWithAnimeAndArtist() {
  const { data, error } = await supabase
    .from('videos')
    .select(`
      *,
      artistables:artistables (
        artists:artists (
          name
        )
      ),
      video_anime (
        animes (
          title_fr
        )
      ),
      genrables (
        genres (
          name
        )
      )
    `)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}