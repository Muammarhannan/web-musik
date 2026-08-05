import { SearchRecommendations } from "@/components/SearchRecommendations";
import { ThemeSelector } from "@/components/ThemeSelector";

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-[#070a16] px-6 py-10 text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <SearchRecommendations />
        <ThemeSelector />
      </div>
    </main>
  );
}
