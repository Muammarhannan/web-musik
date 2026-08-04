import { UploadExperience } from "@/components/UploadExperience";

export default function UploadPage() {
  return (
    <main
      className="min-h-screen px-6 py-10 text-zinc-100"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(34,211,238,0.16), transparent 28%), linear-gradient(135deg, #050816 0%, #111827 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <UploadExperience />
      </div>
    </main>
  );
}
