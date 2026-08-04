import { FavoriteHistoryPanel } from "@/components/FavoriteHistoryPanel";
import { ProfilePanel } from "@/components/ProfilePanel";

export default function ProfilePage() {
  return (
    <main
      className="min-h-screen px-6 py-10 text-zinc-100"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(34,211,238,0.16), transparent 28%), linear-gradient(135deg, #050816 0%, #111827 100%)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <ProfilePanel />
        <FavoriteHistoryPanel />
      </div>
    </main>
  );
}
