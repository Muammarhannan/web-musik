import { PlayerShell } from "@/components/PlayerShell";
import { PlaylistPanel } from "@/components/PlaylistPanel";

export default function PlayerPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),linear-gradient(135deg,_#050816_0%,_#111827_100%)] px-6 py-10 text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <PlayerShell />
        <PlaylistPanel />
      </div>
    </main>
  );
}
