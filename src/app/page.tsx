import Link from "next/link";

export default function Home() {
  return (
    <section className="min-h-screen px-6 py-10 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/40 p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">PixelBeats</p>
              <h1 className="mt-4 text-4xl font-semibold text-white">A private pixel music library.</h1>
              <p className="mt-4 max-w-2xl text-base text-slate-300">
                Upload your MP3s, lyrics, and covers, then play them in a minimalist pixel-inspired player with live visuals and listening stats.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/library" className="rounded-3xl bg-gradient-to-r from-sky-400 to-fuchsia-500 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:opacity-90">
                Explore Library
              </Link>
              <Link href="/upload" className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:border-sky-400">
                Upload Music
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Library", value: "0 songs", description: "Your full private collection." },
            { title: "History", value: "0 plays", description: "Recent listening sessions." },
            { title: "Stats", value: "No data yet", description: "Your habits in one place." },
            { title: "Themes", value: "Pixel Night", description: "Calm pixel art mood." },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 shadow-lg shadow-slate-950/10 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.title}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
              <p className="mt-2 text-sm text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-950/40 p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Pixel themes</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { name: "Pixel City", accent: "from-sky-500 to-indigo-500" },
              { name: "Pixel Forest", accent: "from-emerald-400 to-slate-700" },
              { name: "Pixel Sunset", accent: "from-orange-400 to-rose-500" },
            ].map((theme) => (
              <div key={theme.name} className="rounded-3xl bg-gradient-to-br px-5 py-6 text-white shadow-xl shadow-slate-900/20">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">{theme.name}</p>
                <div className={`mt-4 h-20 rounded-3xl bg-gradient-to-b ${theme.accent}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
