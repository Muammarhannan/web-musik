import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { removeStoredUploadsByUrls, deleteStoredUploadFiles } from "@/lib/data-store";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    const { title, artist, album, genre } = (await request.json()) as {
      title?: string;
      artist?: string;
      album?: string | null;
      genre?: string | null;
    };

    if (!params.id) {
      return Response.json({ ok: false, error: "Song ID tidak valid." }, { status: 400 });
    }

    if (!title?.trim()) {
      return Response.json({ ok: false, error: "Judul lagu diperlukan." }, { status: 400 });
    }

    const song = await prisma.song.update({
      where: { id: params.id },
      data: {
        title: title.trim(),
        artist: artist?.trim() || "Unknown artist",
        album: album?.trim() || null,
        genre: genre?.trim() || null,
        updatedAt: new Date(),
      },
    });

    return Response.json({ ok: true, song });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update song.";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    if (!params.id) {
      return Response.json({ ok: false, error: "Song ID tidak valid." }, { status: 400 });
    }

    const song = await prisma.song.findUnique({ where: { id: params.id } });
    if (!song) {
      return Response.json({ ok: false, error: "Song tidak ditemukan." }, { status: 404 });
    }

    await prisma.song.delete({ where: { id: params.id } });

    const urlsToRemove = [song.audioUrl, song.coverUrl, song.lyricsUrl].filter(
      (url): url is string => typeof url === "string" && url.length > 0,
    );

    await deleteStoredUploadFiles(urlsToRemove);
    await removeStoredUploadsByUrls(urlsToRemove);

    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete song.";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
