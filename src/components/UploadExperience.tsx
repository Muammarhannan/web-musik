"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ImageIcon, Music4, UploadCloud, FileText, LoaderCircle } from "lucide-react";

type UploadItem = {
  id: string;
  name: string;
  type: "audio" | "image" | "text";
  url: string;
  size: number;
};

const maxSizeBytes = 15 * 1024 * 1024;
const acceptedTypes = {
  audio: ["audio/mpeg", "audio/wav", "audio/flac", "audio/x-wav"],
  image: ["image/png", "image/jpeg", "image/webp", "image/jpg"],
  text: ["text/plain", "application/lrc", "text/lrc"],
};

function getFileCategory(file: File): UploadItem["type"] {
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("image/")) return "image";
  return "text";
}

function getLabel(type: UploadItem["type"]) {
  switch (type) {
    case "audio":
      return "Audio";
    case "image":
      return "Cover";
    case "text":
      return "Lyrics";
  }
}

export function UploadExperience() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Drag and drop sounds, covers, or lyric files.");
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    void loadUploads();
  }, []);

  async function loadUploads() {
    const response = await fetch("/api/uploads");
    if (!response.ok) return;
    const data = (await response.json()) as { files: UploadItem[] };
    setUploads(data.files);
  }

  async function uploadFiles(files: File[]) {
    const validFiles = files.filter((file) => {
      const category = getFileCategory(file);
      const allowed = acceptedTypes[category] ?? [];
      const isValidType = allowed.includes(file.type) || file.name.toLowerCase().endsWith(".lrc") || file.name.toLowerCase().endsWith(".txt");
      const isValidSize = file.size <= maxSizeBytes;
      if (!isValidType) {
        setErrors((current) => [...current, `${file.name}: unsupported format`]);
        return false;
      }
      if (!isValidSize) {
        setErrors((current) => [...current, `${file.name}: file exceeds 15MB limit`]);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      setMessage("No valid files were selected.");
      return;
    }

    setIsUploading(true);
    setProgress(10);
    setErrors([]);

    for (let index = 0; index < validFiles.length; index += 1) {
      const file = validFiles[index];
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; file?: UploadItem };
      if (!response.ok || !payload.ok) {
        setErrors((current) => [...current, payload.error ?? `${file.name} could not be uploaded`]);
        continue;
      }
      if (payload.file) {
        setUploads((current) => [payload.file as UploadItem, ...current]);
      }
      setProgress(Math.min(100, Math.round(((index + 1) / validFiles.length) * 100)));
    }

    setMessage("Your media library has been refreshed.");
    setIsUploading(false);
    setProgress(100);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files ?? []);
    void uploadFiles(droppedFiles);
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    void uploadFiles(selected);
  }

  const summary = useMemo(() => {
    const count = uploads.length;
    return {
      count,
      audio: uploads.filter((item) => item.type === "audio").length,
      image: uploads.filter((item) => item.type === "image").length,
      text: uploads.filter((item) => item.type === "text").length,
    };
  }, [uploads]);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Upload studio</p>
            <h2 className="text-2xl font-semibold text-white">Drop your music, covers, and lyrics</h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">Supports audio, image, and lyric uploads with validation, previews, and a local library.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
            {summary.count} files stored locally
          </div>
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`mt-6 rounded-[24px] border border-dashed p-8 text-center transition ${isDragging ? "border-cyan-400 bg-cyan-500/10" : "border-white/15 bg-white/5"}`}
        >
          <div className="mx-auto flex w-fit items-center justify-center rounded-full bg-cyan-500/10 p-4 text-cyan-300">
            <UploadCloud className="h-7 w-7" />
          </div>
          <p className="mt-4 text-lg font-medium text-white">{message}</p>
          <p className="mt-2 text-sm text-zinc-400">MP3, WAV, FLAC, PNG, JPG, WEBP, LRC, TXT up to 15MB.</p>
          <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]">
            <UploadCloud className="h-4 w-4" />
            Choose files
            <input type="file" className="hidden" multiple onChange={onFileChange} />
          </label>
        </div>

        {isUploading ? (
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <div className="flex items-center gap-2 text-sm text-cyan-200">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Uploading files... {progress}%
            </div>
            <div className="mt-3 h-2 rounded-full bg-black/30">
              <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}

        {errors.length > 0 ? (
          <div className="mt-4 space-y-2">
            {errors.map((error) => (
              <div key={error} className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-zinc-400">Audio</p>
          <p className="mt-2 text-2xl font-semibold text-white">{summary.audio}</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-zinc-400">Covers</p>
          <p className="mt-2 text-2xl font-semibold text-white">{summary.image}</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-zinc-400">Lyrics</p>
          <p className="mt-2 text-2xl font-semibold text-white">{summary.text}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {uploads.map((item) => (
          <div key={item.id} className="rounded-[24px] border border-white/10 bg-zinc-950/70 p-4 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm text-cyan-300">
                  {item.type === "audio" ? <Music4 className="h-4 w-4" /> : item.type === "image" ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  {getLabel(item.type)}
                </div>
                <p className="mt-2 font-medium text-white">{item.name}</p>
                <p className="text-sm text-zinc-400">{Math.round(item.size / 1024)} KB</p>
              </div>
              <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            {item.type === "audio" ? <audio controls className="mt-4 w-full" src={item.url} /> : null}
            {item.type === "image" ? <img src={item.url} alt={item.name} className="mt-4 h-40 w-full rounded-2xl object-cover" /> : null}
            {item.type === "text" ? <pre className="mt-4 max-h-36 overflow-auto rounded-2xl bg-black/40 p-3 text-xs text-zinc-300">{item.name}</pre> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
