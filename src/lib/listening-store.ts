export type PlaybackRecord = {
  songId: string;
  title: string;
  artist: string;
  playedAt: string;
  duration: number;
  seconds: number;
};

export type ListeningStats = {
  totalPlays: number;
  totalSeconds: number;
  topSongs: Record<string, number>;
  history: PlaybackRecord[];
  lastPlayed?: string;
};

const LISTENING_STATS_KEY = "pixelbeats-listening-stats";

function isBrowser() {
  return typeof window !== "undefined";
}

export function readListeningStats(): ListeningStats {
  if (!isBrowser()) {
    return {
      totalPlays: 0,
      totalSeconds: 0,
      topSongs: {},
      history: [],
    };
  }

  try {
    const stored = window.localStorage.getItem(LISTENING_STATS_KEY);
    if (!stored) {
      return {
        totalPlays: 0,
        totalSeconds: 0,
        topSongs: {},
        history: [],
      };
    }

    return JSON.parse(stored) as ListeningStats;
  } catch {
    return {
      totalPlays: 0,
      totalSeconds: 0,
      topSongs: {},
      history: [],
    };
  }
}

export function writeListeningStats(stats: ListeningStats) {
  if (!isBrowser()) return;
  window.localStorage.setItem(LISTENING_STATS_KEY, JSON.stringify(stats));
}

export function recordListeningSession(payload: {
  songId: string;
  title: string;
  artist: string;
  duration: number;
  seconds: number;
}) {
  const stats = readListeningStats();
  const playedAt = new Date().toISOString();
  const next: ListeningStats = {
    totalPlays: stats.totalPlays + 1,
    totalSeconds: stats.totalSeconds + payload.seconds,
    topSongs: {
      ...stats.topSongs,
      [payload.songId]: (stats.topSongs[payload.songId] ?? 0) + 1,
    },
    lastPlayed: playedAt,
    history: [
      {
        songId: payload.songId,
        title: payload.title,
        artist: payload.artist,
        playedAt,
        duration: payload.duration,
        seconds: payload.seconds,
      },
      ...stats.history,
    ].slice(0, 100),
  };

  writeListeningStats(next);
  return next;
}

export function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}m ${remainder.toString().padStart(2, "0")}s`;
}
