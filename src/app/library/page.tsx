import Link from "next/link";

export default function LibraryPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/40 p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Library</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Your uploaded songs.</h1>
              <p className="mt-2 text-sm text-slate-400">Browse and play music from your private PixelBeats collection.</p>
            </div>
            <Link href="/upload" className="rounded-3xl bg-gradient-to-r from-sky-400 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
              Upload new song
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-slate-950/10 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Track</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">No songs yet</h2>
                </div>
                <div className="h-16 w-16 rounded-2xl bg-slate-900/80" />
              </div>
              <p className="mt-4 text-sm text-slate-400">Your library will show uploaded songs here once you add them.</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
