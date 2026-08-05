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

    if (!file) {
      return Response.json({ ok: false, error: "No file provided" }, { status: 400 });
    }

    await mkdir(uploadDir, { recursive: true });
    const extension = path.extname(file.name) || ".bin";
    const filename = `${randomUUID()}${extension}`;
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const fileType = file.type.startsWith("audio/") ? "audio" : file.type.startsWith("image/") ? "image" : "text";
    const previewText = fileType === "text" ? await file.text() : undefined;
    const createdAt = new Date().toISOString();

    const payload: UploadResponse = {
      id: filename,
      name: file.name,
      type: fileType,
      url: `/uploads/${filename}`,
      size: file.size,
      previewText,
      createdAt,
    };

    await addStoredUpload(payload);

    try {
      if (fileType === "audio") {
        await createSongRecord({
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Local Upload",
          audioPath: payload.url,
          genre: "Electronica",
        });
      }
    } catch {
      // Persist upload metadata regardless of database availability.
    }

    return Response.json({ ok: true, file: payload });
  } catch (error) {
    return Response.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
