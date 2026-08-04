import Link from "next/link";
import { NowPlayingHero } from "@/components/NowPlayingHero";
import { SearchRecommendations } from "@/components/SearchRecommendations";
import { ThemeSelector } from "@/components/ThemeSelector";

export default function Home() {
  return (
    <main
      className="min-h-screen px-6 py-10 text-zinc-100"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(34,211,238,0.16), transparent 28%), linear-gradient(135deg, #050816 0%, #111827 100%)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <NowPlayingHero />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Milestone 1</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Your local media studio is live</h2>
            <p className="mt-3 text-sm text-zinc-400">Upload audio, album art, and lyric files locally, then jump into playback and visualization from the player view.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/upload" className="rounded-full bg-linear-to-r from-cyan-400 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-black">Upload media</Link>
              <Link href="/player" className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white">Open player</Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Next focus</p>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li>• Persistent playlist management</li>
              <li>• Richer lyric sync and visualization controls</li>
              <li>• Prisma-backed persistence for production-ready storage</li>
            </ul>
          </div>
        </div>
        <SearchRecommendations />
        <ThemeSelector />
      </div>
    </main>
  );
}
