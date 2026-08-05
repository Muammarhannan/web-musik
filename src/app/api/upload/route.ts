import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { addStoredUpload } from "@/lib/data-store";
import { createSongRecord } from "@/lib/song-service";

type UploadResponse = {
  id: string;
  name: string;
  type: "audio" | "image" | "text";
  url: string;
  size: number;
  previewText?: string;
  createdAt: string;
};

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const cover = formData.get("cover") as File | null;
    const lyrics = formData.get("lyrics") as File | null;
    const title = String(formData.get("title") || "").trim();
    const album = String(formData.get("album") || "").trim();
    const info = String(formData.get("info") || "").trim();

    if (!file) {
      return Response.json({ ok: false, error: "File audio diperlukan." }, { status: 400 });
    }
    if (!cover) {
      return Response.json({ ok: false, error: "File cover diperlukan." }, { status: 400 });
    }
    if (!lyrics) {
      return Response.json({ ok: false, error: "File lirik diperlukan." }, { status: 400 });
    }
    if (!title) {
      return Response.json({ ok: false, error: "Judul lagu diperlukan." }, { status: 400 });
    }

    await mkdir(uploadDir, { recursive: true });

    const extension = path.extname(file.name) || ".mp3";
    const filename = `${randomUUID()}${extension}`;
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    const audioUrl = `/uploads/${filename}`;

    const coverExtension = path.extname(cover.name) || ".png";
    const coverFilename = `${randomUUID()}${coverExtension}`;
    const coverPath = path.join(uploadDir, coverFilename);
    await writeFile(coverPath, Buffer.from(await cover.arrayBuffer()));
    const coverUrl = `/uploads/${coverFilename}`;

    const lyricsExtension = path.extname(lyrics.name) || ".lrc";
    const lyricsFilename = `${randomUUID()}${lyricsExtension}`;
    const lyricsPath = path.join(uploadDir, lyricsFilename);
    await writeFile(lyricsPath, Buffer.from(await lyrics.arrayBuffer()));
    const lyricsUrl = `/uploads/${lyricsFilename}`;

    const createdAt = new Date().toISOString();
    const lyricsText = await lyrics.text();

    const payloads: UploadResponse[] = [
      {
        id: filename,
        name: file.name,
        type: "audio",
        url: audioUrl,
        size: file.size,
        createdAt,
      },
      {
        id: coverFilename,
        name: cover.name,
        type: "image",
        url: coverUrl,
        size: cover.size,
        createdAt,
      },
      {
        id: lyricsFilename,
        name: lyrics.name,
        type: "text",
        url: lyricsUrl,
        size: lyrics.size,
        previewText: lyricsText,
        createdAt,
      },
    ];

    await Promise.all(payloads.map(addStoredUpload));

    try {
      await createSongRecord({
        title,
        artist: "PixelBeats",
        album: album || undefined,
        audioPath: audioUrl,
        coverPath: coverUrl,
        lyricsPath: lyricsUrl,
        genre: info || undefined,
      });
    } catch {
      // Persist upload metadata regardless of database availability.
    }

    return Response.json({ ok: true, files: payloads });
  } catch (error) {
    return Response.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
