export default function SettingsPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/40 p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Settings</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Personalize PixelBeats.</h1>
          <p className="mt-2 text-sm text-slate-400">Choose your player theme and control how your private library behaves.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-slate-950/10 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Theme</p>
            <div className="mt-4 space-y-3">
              {[
                { name: "Pixel Night", description: "Dark, calm, and neon." },
                { name: "Sunset Glow", description: "Warm gradients with soft haze." },
              ].map((theme) => (
                <div key={theme.name} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">{theme.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{theme.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-slate-950/10 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Privacy</p>
            <p className="mt-4 text-sm text-slate-400">PixelBeats is local-first, storing your uploads and listening data privately on this machine.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
