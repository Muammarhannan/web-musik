import { LyricPanel } from "@/components/LyricPanel";
import { PlayerShell } from "@/components/PlayerShell";
import { PlaylistPanel } from "@/components/PlaylistPanel";
import { VisualizerPanel } from "@/components/VisualizerPanel";

export default function PlayerPage() {
  return (
    <main className="min-h-screen bg-[#070a16] px-6 py-10 text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <LyricPanel />
          <VisualizerPanel />
        </div>
        <PlaylistPanel />
      </div>
    </main>
  );
}
