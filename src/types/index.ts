export type NavItem = {
  label: string;
  href: string;
};

export type SongRecord = {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  audioUrl?: string;
  duration?: number;
};
