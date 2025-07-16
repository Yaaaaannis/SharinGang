export interface Clip {
  youtube_id: string;
  titre: string;
  artist: string;
  anime: string;
  type: 'opening' | 'ending' | 'ost';
  type_number?: number;
  status: 'published' | 'draft' | 'suggested' | 'rejected' | 'error';
}

export const clips: Clip[] = [
  {
    youtube_id: "gcjdXMfYIe4",
    titre: "We Are !",
    artist: "Hiroshi Kitadani",
    anime: "One Piece",
    type: "opening",
    type_number: 1,
    status: "published",
  },
  {
    youtube_id: "2upuBiEiXDk",
    titre: "Blue Bird",
    artist: "Ikimono Gakari",
    anime: "Naruto Shippuden",
    type: "opening",
    type_number: 3,
    status: "published",
  },
  {
    youtube_id: "UhwHbSi4Z58",
    titre: "Unravel",
    artist: "Ling Toshite Sigure",
    anime: "Tokyo Ghoul",
    type: "opening",
    type_number: 1,
    status: "published",
  },
  // Ajoute d'autres clips ici
]; 