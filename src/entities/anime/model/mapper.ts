import type { RawAnime, AnimeItem } from "./types";

export function mapAnime(raw: RawAnime[]): AnimeItem[] {
  const result: AnimeItem[] = [];
  for (const a of raw) {
    result.push({
      id: a.id,
      title: a.title.english ?? a.title.romaji ?? "Untitled",
      cover: a.coverImage.large ?? "",
      year: a.seasonYear,
      episodes: a.episodes,
      score: a.averageScore,
      genres: a.genres,
      url: a.siteUrl,
    });
  }
  return result;
}
