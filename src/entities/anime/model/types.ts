// Raw GraphQL response slice
export interface RawAnime {
  id: number;
  title: { romaji: string | null; english: string | null };
  coverImage: { large: string | null };
  seasonYear: number | null;
  episodes: number | null;
  averageScore: number | null;
  genres: string[];
  siteUrl: string;
}

// Clean shape for UI (Bonus 4: data mapper)
export interface AnimeItem {
  id: number;
  title: string;
  cover: string;
  year: number | null;
  episodes: number | null;
  score: number | null;
  genres: string[];
  url: string;
}

export interface AnimePage {
  items: AnimeItem[];
  currentPage: number;
  hasNextPage: boolean;
  total: number;
}
