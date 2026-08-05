import { getSongs } from "@/lib/song-service";
import { LibraryManager } from "@/components/LibraryManager";

export default async function LibraryPage() {
  const songs = await getSongs();

  return (
    <main className="min-h-screen px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <LibraryManager initialSongs={songs} />
      </div>
    </main>
  );
}
