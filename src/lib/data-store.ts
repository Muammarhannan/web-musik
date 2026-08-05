import { promises as fs } from "fs";
import path from "path";

type UploadMetadata = {
  id: string;
  name: string;
  type: "audio" | "image" | "text";
  url: string;
  size: number;
  previewText?: string;
  createdAt: string;
};

const dataPath = path.join(process.cwd(), "data");
const uploadsPath = path.join(dataPath, "uploads.json");
const uploadDir = path.join(process.cwd(), "public", "uploads");

async function ensureDataPath() {
  await fs.mkdir(dataPath, { recursive: true });
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T) {
  await ensureDataPath();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function readStoredUploads(): Promise<UploadMetadata[]> {
  return readJsonFile<UploadMetadata[]>(uploadsPath, []);
}

export async function writeStoredUploads(items: UploadMetadata[]) {
  return writeJsonFile(uploadsPath, items);
}

export async function addStoredUpload(item: UploadMetadata) {
  const current = await readStoredUploads();
  const next = [item, ...current.filter((existing) => existing.id !== item.id)];
  await writeStoredUploads(next);
  return item;
}

export async function removeStoredUploadsByUrls(urls: string[]) {
  const current = await readStoredUploads();
  const next = current.filter((item) => !urls.includes(item.url));
  if (next.length !== current.length) {
    await writeStoredUploads(next);
  }
  return next;
}

export async function deleteStoredUploadFiles(urls: string[]) {
  const normalizedUrls = urls.filter((url) => typeof url === "string" && url.startsWith("/uploads/"));
  await Promise.all(
    normalizedUrls.map(async (url) => {
      const filename = url.replace("/uploads/", "");
      const filePath = path.join(uploadDir, filename);
      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore missing or inaccessible files.
      }
    }),
  );
}
