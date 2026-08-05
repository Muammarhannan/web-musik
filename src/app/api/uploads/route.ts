import { readStoredUploads } from "@/lib/data-store";

export async function GET() {
  const uploads = await readStoredUploads();
  return Response.json({ files: uploads });
}
