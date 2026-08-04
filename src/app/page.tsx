import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_30%),linear-gradient(135deg,_#050816_0%,_#111827_100%)] px-6 py-16 text-zinc-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-[36px] border border-white/10 bg-black/35 p-8 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">LyricMotion</p>
            <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">A premium music experience that feels alive.</h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-300">This first milestone establishes the immersive shell, polished dashboard, and local foundation for uploads, playlists, and animated lyrics.</p>
          </div>
          <Link href="/dashboard" className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]">
            Open dashboard
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Immersive UI", "Premium dashboard with glassmorphism and cinematic motion."],
            ["Local foundation", "Prisma and environment setup prepared for future database features."],
            ["Ready for expansion", "Upload, player, lyrics, and visualizer modules will be added next."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h2 className="text-lg font-medium text-white">{title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
