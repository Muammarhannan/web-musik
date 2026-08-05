import { prisma } from "@/lib/prisma";

export const SYSTEM_USER_EMAIL = "system@lyricmotion.local";

export async function getOrCreateSystemUser() {
  let user = await prisma.user.findUnique({ where: { email: SYSTEM_USER_EMAIL } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: SYSTEM_USER_EMAIL,
        name: "LyricMotion System",
        image: "",
      },
    });
  }
  return user;
}

export async function createSongRecord(params: {
  title: string;
  artist: string;
  audioUrl?: string;
  coverUrl?: string;
  lyricsUrl?: string;
  genre?: string;
  duration?: number;
}) {
  const user = await getOrCreateSystemUser();
  return prisma.song.create({
    data: {
      title: params.title,
      artist: params.artist,
      album: params.title,
      genre: params.genre ?? "Electronic",
      audioUrl: params.audioUrl,
      coverUrl: params.coverUrl,
      lyricsUrl: params.lyricsUrl,
      duration: params.duration,
      userId: user.id,
    },
  });
}

export async function getSongs() {
  return prisma.song.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createLyricsRecord(params: {
  title: string;
  content: string;
  format: string;
}) {
  return prisma.lyrics.create({
    data: {
      title: params.title,
      content: params.content,
      format: params.format,
    },
  });
}
