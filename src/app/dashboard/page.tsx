import { Music4, Upload, Library, Heart, History, Sparkles, Radio, Compass, Settings, UserRound } from "lucide-react";
import { getSongs } from "@/lib/song-service";
import { readStoredUploads } from "@/lib/data-store";

const navItems = [
  { label: "Home", icon: Sparkles },
  { label: "Discover", icon: Compass },
  { label: "Upload", icon: Upload },
  { label: "Library", icon: Library },
  { label: "Playlist", icon: Music4 },
  { label: "Favorite", icon: Heart },
  { label: "History", icon: History },
  { label: "Profile", icon: UserRound },
  { label: "Settings", icon: Settings },
];

export default async function DashboardPage() {
  const songs = await getSongs();
  const uploads = await readStoredUploads();

  return (
    <main className="min-h-screen bg-[#070a16] p-6 text-zinc-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <aside className="w-full rounded-3xl border border-white/10 bg-slate-950/50 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl lg:w-72">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3 text-slate-100">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">PixelBeats</p>
              <p className="text-sm text-slate-400">Premium listening</p>
            </div>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.label} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="flex-1 space-y-6">
          <div className="rounded-4xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Now feeling</p>
                <h1 className="text-4xl font-semibold text-white">Immersive soundscapes</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-400">A cinematic music experience with animated lyrics, live visuals, and an elegant personal library.</p>
              </div>
              <button className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                Start listening
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-4xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Song library</p>
              <p className="mt-4 text-4xl font-semibold text-white">{songs.length}</p>
              <p className="mt-2 text-sm text-slate-400">Total songs in your private PixelBeats collection.</p>
            </div>
            <div className="rounded-4xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Stored uploads</p>
              <p className="mt-4 text-4xl font-semibold text-white">{uploads.length}</p>
              <p className="mt-2 text-sm text-slate-400">File yang diunggah melalui studio unggah.</p>
            </div>
            <div className="rounded-4xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Recent upload</p>
              <p className="mt-4 text-4xl font-semibold text-white">{uploads[0]?.name ?? "—"}</p>
              <p className="mt-2 text-sm text-slate-400">Last file added to your collection.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
