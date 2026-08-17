import { ref } from "vue";
import { gqlClient } from "@/shared/api/graphql";
import { SEARCH_ANIME } from "./queries";
import { mapAnime } from "@/entities/anime/model/mapper";
import type { AnimeItem, RawAnime } from "@/entities/anime/model/types";

interface GqlResponse {
  Page: {
    pageInfo: { currentPage: number; hasNextPage: boolean; total: number };
    media: RawAnime[];
  };
}

const PER_PAGE = 12;

export function useAnimeSearch() {
  const data = ref<AnimeItem[]>([]);
  const loading = ref(false);
  const error = ref(false);
  const hasNextPage = ref(false);
  const currentKeyword = ref("");
  const currentPage = ref(1);

  let requestId = 0;

  async function fetchPage(keyword: string, page: number, append: boolean) {
    const myId = ++requestId;
    loading.value = true;
    error.value = false;
    const trimmed = keyword.trim();
    const hasKeyword = trimmed.length > 0;
    try {
      const res = await gqlClient.request<GqlResponse>(SEARCH_ANIME, {
        search: hasKeyword ? trimmed : undefined, // omit -> return all
        page,
        perPage: PER_PAGE,
        sort: hasKeyword
          ? ["SEARCH_MATCH", "POPULARITY_DESC"]
          : ["POPULARITY_DESC"],
      });
      if (myId !== requestId) return; // stale guard
      const items = mapAnime(res.Page.media);
      data.value = append ? data.value.concat(items) : items;
      hasNextPage.value = res.Page.pageInfo.hasNextPage;
      currentPage.value = res.Page.pageInfo.currentPage;
    } catch (e) {
      if (myId !== requestId) return;
      error.value = true;
    } finally {
      if (myId === requestId) loading.value = false;
    }
  }

  function searchAnime(keyword: string) {
    currentKeyword.value = keyword;
    return fetchPage(keyword, 1, false);
  }

  function loadMore() {
    if (!hasNextPage.value || loading.value) return;
    return fetchPage(currentKeyword.value, currentPage.value + 1, true);
  }

  return { data, loading, error, hasNextPage, searchAnime, loadMore };
}
