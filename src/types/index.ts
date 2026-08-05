export type NavItem = {
  label: string;
  href: string;
};

export type SongRecord = {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  genre?: string | null;
  coverUrl?: string;
  audioUrl?: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
};
