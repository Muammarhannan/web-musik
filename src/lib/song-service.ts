import { prisma } from "@/lib/prisma";

export type SongRecord = {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  genre?: string | null;
  duration?: number | null;
  audioUrl?: string | null;
  coverUrl?: string | null;
  lyricsUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

const LOCAL_USER_ID = "local-user";

export async function createSongRecord(params: {
  title: string;
  artist: string;
  album?: string;
  audioPath: string;
  coverPath?: string;
  lyricsPath?: string;
  genre?: string;
  duration?: number;
  userId?: string;
}) {
  await prisma.user.upsert({
    where: { id: params.userId ?? LOCAL_USER_ID },
    update: {},
    create: {
      id: params.userId ?? LOCAL_USER_ID,
      email: `${params.userId ?? LOCAL_USER_ID}@pixelbeats.local`,
      name: "Local listener",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return prisma.song.create({
    data: {
      title: params.title,
      artist: params.artist,
      album: params.album,
      genre: params.genre,
      audioUrl: params.audioPath,
      coverUrl: params.coverPath,
      lyricsUrl: params.lyricsPath,
      duration: params.duration,
      userId: params.userId ?? LOCAL_USER_ID,
      updatedAt: new Date(),
    },
  });
}

export async function getSongs() {
  const songs = await prisma.song.findMany({
    orderBy: { createdAt: "desc" },
  });

  return songs.map((song) => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    album: song.album,
    genre: song.genre,
    duration: song.duration,
    audioUrl: song.audioUrl ?? undefined,
    coverUrl: song.coverUrl ?? undefined,
    lyricsUrl: song.lyricsUrl ?? undefined,
    createdAt: song.createdAt.toISOString(),
    updatedAt: song.updatedAt.toISOString(),
    userId: song.userId,
  }));
}
