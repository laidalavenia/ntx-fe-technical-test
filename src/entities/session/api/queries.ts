import { gql } from "graphql-request";

export const SEARCH_ANIME = gql`
  query SearchAnime(
    $search: String
    $page: Int
    $perPage: Int
    $sort: [MediaSort]
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
        total
      }
      media(search: $search, type: ANIME, sort: $sort) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        seasonYear
        episodes
        averageScore
        genres
        siteUrl
      }
    }
  }
`;
