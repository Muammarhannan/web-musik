export default function StatisticsPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/40 p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Statistics</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Your listening analytics.</h1>
          <p className="mt-2 text-sm text-slate-400">Track play history, total listening time, and your most-played songs.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: "Total plays", value: "0" },
            { label: "Listening time", value: "0 min" },
            { label: "Top song", value: "—" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-slate-950/10 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
