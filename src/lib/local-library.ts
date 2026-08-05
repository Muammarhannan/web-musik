export type LibraryItemType = "audio" | "image" | "text";

export type LibraryItem = {
  id: string;
  name: string;
  type: LibraryItemType;
  url: string;
  size: number;
  previewText?: string;
  createdAt: string;
};

export type PlaylistItem = {
  id: string;
  title: string;
  artist: string;
  createdAt: string;
};

const UPLOADS_KEY = "pixelbeats-uploads";
const PLAYLISTS_KEY = "pixelbeats-playlists";

export function readUploads(): LibraryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(UPLOADS_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as LibraryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeUploads(items: LibraryItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(UPLOADS_KEY, JSON.stringify(items));
}

export function readPlaylists(): PlaylistItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(PLAYLISTS_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as PlaylistItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writePlaylists(items: PlaylistItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(items));
}

export function getAudioItems(items: LibraryItem[]) {
  return items.filter((item) => item.type === "audio");
}

export function parseLyrics(content: string) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/\[(\d{2}):(\d{2}(?:\.\d{1,3})?)\]/);
      if (match) {
        const minutes = Number(match[1]);
        const seconds = Number(match[2]);
        return {
          time: minutes * 60 + seconds,
          text: line.replace(/\[[^\]]*\]/g, "").trim(),
        };
      }

      return {
        time: 0,
        text: line,
      };
    })
    .filter((line) => line.text.length > 0);

  return lines.length > 0 ? lines : [{ time: 0, text: content }];
}
