"use client";

import { ChangeEvent, DragEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ImageIcon, Music4, UploadCloud, FileText, LoaderCircle } from "lucide-react";
import { getAudioItems, readUploads, writeUploads, type LibraryItem } from "@/lib/local-library";

type UploadItem = LibraryItem;

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
  const [message, setMessage] = useState("Seret file audio, cover, dan lirik, atau pilih semuanya secara manual.");
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [album, setAlbum] = useState("");
  const [info, setInfo] = useState("");
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [selectedLyricsFile, setSelectedLyricsFile] = useState<File | null>(null);

  useEffect(() => {
    const stored = readUploads();
    if (stored.length > 0) {
      setUploads(stored);
      return;
    }

    void loadUploads();
  }, []);

  async function loadUploads() {
    const response = await fetch("/api/uploads");
    if (!response.ok) return;
    const data = (await response.json()) as { files: UploadItem[] };
    const normalized = data.files.map((item) => ({ ...item, createdAt: item.createdAt ?? new Date().toISOString() }));
    setUploads(normalized);
    writeUploads(normalized);
  }

  async function uploadFiles(files: File[]) {
    const nextErrors: string[] = [];
    let audioFile: File | undefined;
    let coverFile: File | undefined;
    let lyricsFile: File | undefined;

    files.forEach((file) => {
      if (file.type.startsWith("audio/")) {
        audioFile = file;
        return;
      }
      if (file.type.startsWith("image/")) {
        coverFile = file;
        return;
      }
      if (acceptedTypes.text.includes(file.type) || file.name.toLowerCase().endsWith(".lrc") || file.name.toLowerCase().endsWith(".txt")) {
        lyricsFile = file;
        return;
      }
      nextErrors.push(`${file.name}: format tidak didukung.`);
    });

    if (!audioFile) {
      nextErrors.push("File audio diperlukan.");
    }
    if (!coverFile) {
      nextErrors.push("Cover image diperlukan.");
    }
    if (!lyricsFile) {
      nextErrors.push("File lirik diperlukan.");
    }

    if (audioFile) {
      if (!acceptedTypes.audio.includes(audioFile.type)) {
        nextErrors.push("File audio harus berformat MP3, WAV, atau FLAC.");
      }
      if (audioFile.size > maxSizeBytes) {
        nextErrors.push("File audio harus kurang dari 15MB.");
      }
    }

    if (coverFile && coverFile.size > maxSizeBytes) {
      nextErrors.push("File cover harus kurang dari 15MB.");
    }

    if (lyricsFile) {
      const isLyricsType = acceptedTypes.text.includes(lyricsFile.type) || lyricsFile.name.toLowerCase().endsWith(".lrc") || lyricsFile.name.toLowerCase().endsWith(".txt");
      if (!isLyricsType) {
        nextErrors.push("File lirik harus berupa .lrc atau .txt.");
      }
      if (lyricsFile.size > maxSizeBytes) {
        nextErrors.push("File lirik harus kurang dari 15MB.");
      }
    }

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      setMessage("Periksa file upload dan coba lagi.");
      return;
    }

    if (!audioFile || !coverFile || !lyricsFile) {
      setErrors(["Pilih file audio, cover, dan lirik terlebih dahulu."]);
      setMessage("Lengkapi semua file sebelum upload.");
      return;
    }

    setIsUploading(true);
    setProgress(10);
    setErrors([]);

    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("cover", coverFile);
    formData.append("lyrics", lyricsFile);
    formData.append("title", title);
    formData.append("album", album);
    formData.append("info", info);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as { ok?: boolean; error?: string; files?: UploadItem[] };
    if (!response.ok || !payload.ok) {
      setErrors([payload.error ?? "Upload gagal. Coba lagi."]);
      setIsUploading(false);
      return;
    }

    const uploadedFiles = Array.isArray(payload.files) ? payload.files : [];
    if (uploadedFiles.length) {
      setUploads((current) => {
        const next = [...uploadedFiles, ...current];
        writeUploads(next);
        return next;
      });
    }

    setMessage("Lagu, cover, dan lirik berhasil diunggah.");
    setIsUploading(false);
    setProgress(100);
    setSelectedAudioFile(null);
    setSelectedCoverFile(null);
    setSelectedLyricsFile(null);
    setTitle("");
    setAlbum("");
    setInfo("");
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) {
      return;
    }

    void uploadFiles(Array.from(files));
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setSelectedAudioFile(null);
      return;
    }

    setSelectedAudioFile(files[0]);
  }

  function onCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setSelectedCoverFile(null);
      return;
    }

    setSelectedCoverFile(files[0]);
  }

  function onLyricsChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setSelectedLyricsFile(null);
      return;
    }

    setSelectedLyricsFile(files[0]);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedAudioFile || !selectedCoverFile || !selectedLyricsFile) {
      setErrors(["Pilih file audio, cover, dan lirik terlebih dahulu."]);
      return;
    }
    if (!title.trim()) {
      setErrors(["Judul lagu diperlukan."]);
      return;
    }

    await uploadFiles([selectedAudioFile, selectedCoverFile, selectedLyricsFile]);
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

  const audioItems = useMemo(() => getAudioItems(uploads), [uploads]);

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Upload studio</p>
            <h2 className="text-2xl font-semibold text-white">Upload lagu baru</h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">Masukkan MP3, judul, album, dan informasi yang tampil saat diputar.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
            {summary.count} files disimpan
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <label className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
            <span className="text-sm text-slate-400">MP3 File</span>
            <input type="file" accept="audio/*" onChange={onFileChange} className="rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-sm text-white outline-none file:rounded-full file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-white" />
            {selectedAudioFile ? <span className="text-xs text-zinc-500">{selectedAudioFile.name}</span> : null}
          </label>
          <label className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
            <span className="text-sm text-slate-400">Cover Image</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onCoverChange} className="rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-sm text-white outline-none file:rounded-full file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-white" />
            {selectedCoverFile ? <span className="text-xs text-zinc-500">{selectedCoverFile.name}</span> : null}
          </label>
          <label className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
            <span className="text-sm text-slate-400">File Lirik</span>
            <input type="file" accept=".lrc,.txt" onChange={onLyricsChange} className="rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-sm text-white outline-none file:rounded-full file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-white" />
            {selectedLyricsFile ? <span className="text-xs text-zinc-500">{selectedLyricsFile.name}</span> : null}
          </label>
          <label className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
            <span className="text-sm text-slate-400">Judul Lagu</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Contoh: Midnight Pulse" className="rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-sm text-white outline-none" />
          </label>
          <label className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
            <span className="text-sm text-slate-400">Nama Album</span>
            <input value={album} onChange={(event) => setAlbum(event.target.value)} placeholder="Contoh: Neon Nights" className="rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-sm text-white outline-none" />
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-2 rounded-3xl border border-white/10 bg-slate-950/80 p-4">
          <span className="text-sm text-slate-400">Informasi saat diputar</span>
          <textarea value={info} onChange={(event) => setInfo(event.target.value)} placeholder="Contoh: Dreamwave track dengan nuansa ambient dan bass lembut" className="min-h-30 rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-sm text-white outline-none" />
        </label>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" className="rounded-3xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Upload Lagu
          </button>
          <p className="text-sm text-slate-400">Pastikan semua field terisi sebelum menekan upload.</p>
        </div>

        <div
          className={`mt-6 rounded-3xl border border-dashed p-8 text-center transition ${isDragging ? "border-slate-400 bg-slate-900/80" : "border-slate-700 bg-slate-950/80"}`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <div className="mx-auto flex w-fit items-center justify-center rounded-full bg-slate-800/90 p-4 text-slate-200">
            <UploadCloud className="h-7 w-7" />
          </div>
          <p className="mt-4 text-lg font-medium text-white">{message}</p>
          <p className="mt-2 text-sm text-zinc-400">MP3, cover image, dan file lirik wajib. Semua file maksimal 15MB.</p>
        </div>

        {isUploading ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-white">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Uploading files... {progress}%
            </div>
            <div className="mt-3 h-2 rounded-full bg-black/30">
              <div className="h-2 rounded-full bg-white" style={{ width: `${progress}%` }} />
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
      </form>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-zinc-400">Audio</p>
          <p className="mt-2 text-2xl font-semibold text-white">{summary.audio}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-zinc-400">Covers</p>
          <p className="mt-2 text-2xl font-semibold text-white">{summary.image}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-zinc-400">Lyrics</p>
          <p className="mt-2 text-2xl font-semibold text-white">{summary.text}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {audioItems.length > 0 ? (
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 xl:col-span-2">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Ready to play</p>
            <p className="mt-2 text-white">{audioItems[0].name} sudah siap diputar.</p>
          </div>
        ) : null}
        {uploads.map((item) => (
          <div key={item.id} className="rounded-3xl border border-white/10 bg-zinc-950/70 p-4 backdrop-blur-xl">
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
