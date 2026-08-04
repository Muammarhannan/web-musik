import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  try {
    const files = await fs.readdir(uploadDir);
    const payload = files
      .filter((item) => !item.startsWith("."))
      .map((item) => {
        const isAudio = [".mp3", ".wav", ".flac"].some((extension) => item.toLowerCase().endsWith(extension));
        const isImage = /\.(png|jpe?g|webp)$/i.test(item);

        return {
          id: item,
          name: item,
          type: isAudio ? "audio" : isImage ? "image" : "text",
          url: `/uploads/${item}`,
          size: 0,
        };
      });

    return Response.json({ files: payload });
  } catch {
    return Response.json({ files: [] });
  }
}
