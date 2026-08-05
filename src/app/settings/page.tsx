import { ThemeSelector } from "@/components/ThemeSelector";

export default function SettingsPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-4xl border border-white/10 bg-slate-950/40 p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Settings</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Personalize PixelBeats.</h1>
          <p className="mt-2 text-sm text-slate-400">Choose your player theme and control how your private library behaves.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ThemeSelector />
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-slate-950/10 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Theme guide</p>
            <p className="mt-4 text-sm text-slate-400">Pilih tema pixel untuk mengubah nuansa visualisasi dan warna player.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
