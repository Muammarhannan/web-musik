import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

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

    return Response.json({
      ok: true,
      file: {
        id: filename,
        name: file.name,
        type: fileType,
        url: `/uploads/${filename}`,
        size: file.size,
      },
    });
  } catch (error) {
    return Response.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
