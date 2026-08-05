import { LyricPanel } from "@/components/LyricPanel";
import { NowPlayingHero } from "@/components/NowPlayingHero";
import { VisualizerPanel } from "@/components/VisualizerPanel";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <NowPlayingHero />

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <VisualizerPanel />
          <LyricPanel />
        </div>

        <div className="rounded-4xl border border-white/10 bg-slate-950/40 p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">PixelBeats</p>
              <h1 className="mt-4 text-4xl font-semibold text-white">A private pixel music library.</h1>
              <p className="mt-4 max-w-2xl text-base text-slate-300">
                Upload your MP3s, album metadata, and info text, then enjoy smooth playback with live visuals and synced lyrics.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/library" className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                Explore Library
              </Link>
              <Link href="/upload" className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                Upload Music
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
