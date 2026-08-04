import { Music4, Upload, Library, Heart, History, Sparkles, Radio, Compass, Settings, UserRound } from "lucide-react";

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

const featuredSongs = [
  { title: "Midnight Pulse", artist: "Liora", time: "4:21", cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80" },
  { title: "Neon Drift", artist: "Aster", time: "3:52", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80" },
  { title: "Aurora Bloom", artist: "Mina", time: "5:01", cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_30%),linear-gradient(135deg,_#06070b_0%,_#0f1424_100%)] p-6 text-zinc-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <aside className="w-full rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl lg:w-72">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-400/20 p-3 text-cyan-300">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">LyricMotion</p>
              <p className="text-sm text-zinc-400">Premium listening</p>
            </div>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.label} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="flex-1 space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-zinc-950/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Now feeling</p>
                <h1 className="text-4xl font-semibold text-white">Immersive soundscapes</h1>
                <p className="mt-2 max-w-2xl text-sm text-zinc-400">A cinematic music experience with animated lyrics, live visuals, and an elegant personal library.</p>
              </div>
              <button className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.02]">
                Start listening
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[32px] border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Featured tracks</h2>
                <button className="text-sm text-cyan-400">View all</button>
              </div>
              <div className="space-y-3">
                {featuredSongs.map((song) => (
                  <div key={song.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-3">
                      <img src={song.cover} alt={song.title} className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-medium text-white">{song.title}</p>
                        <p className="text-sm text-zinc-400">{song.artist}</p>
                      </div>
                    </div>
                    <div className="text-sm text-zinc-400">{song.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Live visualizer</p>
              <div className="mt-6 h-44 rounded-[24px] border border-white/10 bg-zinc-950/60 p-4">
                <div className="flex h-full items-end justify-between gap-2">
                  {Array.from({ length: 24 }).map((_, index) => (
                    <div key={index} className="w-full rounded-full bg-gradient-to-t from-cyan-400 to-fuchsia-500" style={{ height: `${25 + ((index * 13) % 60)}%` }} />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-300">Realtime visuals will follow the audio in upcoming milestones.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
