import { gql } from "graphql-request";

// $search, $page, $perPage are GraphQL variables (passed separately, not inlined)
export const SEARCH_ANIME = gql`
  query SearchAnime($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
        total
      }
      media(search: $search, type: ANIME) {
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
