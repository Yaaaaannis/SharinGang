-- CreateTable
CREATE TABLE "animes" (
    "id" INTEGER NOT NULL,
    "title_fr" TEXT NOT NULL,
    "title_en" TEXT,
    "title_original" TEXT,
    "info_url_fr" TEXT,
    "info_url_en" TEXT,
    "type" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "animes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "ytid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "is_featured" BOOLEAN,
    "type" TEXT,
    "number" INTEGER,
    "status" TEXT,
    "view_count" INTEGER,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "artistablesArtist_id" INTEGER,
    "artistablesArtistable_id" INTEGER,
    "artistablesArtistable_type" TEXT,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artistables" (
    "artist_id" INTEGER NOT NULL,
    "artistable_id" INTEGER NOT NULL,
    "artistable_type" TEXT NOT NULL,

    CONSTRAINT "artistables_pkey" PRIMARY KEY ("artist_id","artistable_id","artistable_type")
);

-- CreateTable
CREATE TABLE "video_anime" (
    "video_id" INTEGER NOT NULL,
    "anime_id" INTEGER NOT NULL,

    CONSTRAINT "video_anime_pkey" PRIMARY KEY ("video_id","anime_id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genrables" (
    "genre_id" INTEGER NOT NULL,
    "genrable_id" INTEGER NOT NULL,
    "genrable_type" TEXT NOT NULL,

    CONSTRAINT "genrables_pkey" PRIMARY KEY ("genre_id","genrable_id","genrable_type")
);

-- CreateTable
CREATE TABLE "anime_genres" (
    "genre_id" INTEGER NOT NULL,
    "anime_id" INTEGER NOT NULL,

    CONSTRAINT "anime_genres_pkey" PRIMARY KEY ("genre_id","anime_id")
);

-- CreateTable
CREATE TABLE "video_genres" (
    "genre_id" INTEGER NOT NULL,
    "video_id" INTEGER NOT NULL,

    CONSTRAINT "video_genres_pkey" PRIMARY KEY ("genre_id","video_id")
);

-- AddForeignKey
ALTER TABLE "artistables" ADD CONSTRAINT "artistables_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artistables" ADD CONSTRAINT "artistables_artistable_id_fkey" FOREIGN KEY ("artistable_id") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_anime" ADD CONSTRAINT "video_anime_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_anime" ADD CONSTRAINT "video_anime_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genrables" ADD CONSTRAINT "genrables_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genrables" ADD CONSTRAINT "genrables_anime_id_fkey" FOREIGN KEY ("genrable_id") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genrables" ADD CONSTRAINT "genrables_video_id_fkey" FOREIGN KEY ("genrable_id") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_genres" ADD CONSTRAINT "video_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_genres" ADD CONSTRAINT "video_genres_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
