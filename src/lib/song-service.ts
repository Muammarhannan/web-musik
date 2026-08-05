import { prisma } from "@/lib/prisma";

export type SongRecord = {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  genre?: string | null;
  duration?: number | null;
  audioUrl: string;
  coverUrl?: string | null;
  lyricsUrl?: string | null;
  createdAt: Date;
};

export async function createSongRecord(params: {
  title: string;
  artist: string;
  audioPath: string;
  coverPath?: string;
  lyricsPath?: string;
  genre?: string;
  duration?: number;
}) {
  return prisma.song.create({
    data: {
      title: params.title,
      artist: params.artist,
      genre: params.genre,
      audio_path: params.audioPath,
      cover_path: params.coverPath,
      lyrics_path: params.lyricsPath,
      duration: params.duration,
    },
  });
}

export async function getSongs() {
  const songs = await prisma.song.findMany({
    orderBy: { created_at: "desc" },
  });

  return songs.map((song) => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    album: song.album,
    genre: song.genre,
    duration: song.duration,
    audioUrl: song.audio_path,
    coverUrl: song.cover_path,
    lyricsUrl: song.lyrics_path,
    createdAt: song.created_at,
  }));
}
