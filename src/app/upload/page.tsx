import { UploadExperience } from "@/components/UploadExperience";

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),linear-gradient(135deg,_#050816_0%,_#111827_100%)] px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-6xl">
        <UploadExperience />
      </div>
    </main>
  );
}
