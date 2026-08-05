import { getSongs } from "@/lib/song-service";

export async function GET() {
  const songs = await getSongs();
  return Response.json({ songs });
}
