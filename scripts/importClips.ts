import { PrismaClient } from '@prisma/client';
import { clips } from '../components/data/clips';

const prisma = new PrismaClient();

async function main() {
  for (const clip of clips) {
    // 1. Trouver ou créer l'anime
    let anime = await prisma.anime.findFirst({ where: { original_name: clip.anime } });
    if (!anime) {
      anime = await prisma.anime.create({ data: { original_name: clip.anime } });
    }

    // 2. Trouver ou créer l'artiste
    let artist = await prisma.artist.findFirst({ where: { name: clip.artist } });
    if (!artist) {
      artist = await prisma.artist.create({ data: { name: clip.artist } });
    }

    // 3. Créer la vidéo
    await prisma.video.create({
      data: {
        youtube_id: clip.youtube_id,
        anime_id: anime.id,
        artist_id: artist.id,
        titre: clip.titre,
        type: clip.type,
        type_number: clip.type_number,
        status: clip.status,
      }
    });
  }
  console.log('Import terminé !');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
