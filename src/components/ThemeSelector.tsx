"use client";

import { useState } from "react";
import { Palette } from "lucide-react";

const themes = ["Midnight", "Aurora", "Ocean", "Sakura", "Cyberpunk", "Dream"];

export function ThemeSelector() {
  const [activeTheme, setActiveTheme] = useState("Midnight");

  return (
    <div className="rounded-[32px] border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-2xl">
      <div className="flex items-center gap-2 text-cyan-300">
        <Palette className="h-5 w-5" />
        <h3 className="text-xl font-semibold text-white">Theme</h3>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {themes.map((theme) => (
          <button key={theme} onClick={() => setActiveTheme(theme)} className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${activeTheme === theme ? "border-cyan-400 bg-cyan-400/10 text-white" : "border-white/10 bg-white/5 text-zinc-400"}`}>
            {theme}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-zinc-400">Selected theme: {activeTheme}</p>
    </div>
  );
}
