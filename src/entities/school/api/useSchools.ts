import { useQuery } from "@tanstack/vue-query";
import { httpGet } from "@/shared/api/http";
import { mapSchools } from "@/entities/school/model/mapper";
import type { RawSchool, School } from "@/entities/school/model/types";

// Signature matches the bonus requirement: { schools, loading, error, fetchSchools }
export function useSchools() {
  const query = useQuery({
    queryKey: ["schools"],
    queryFn: async (): Promise<School[]> => {
      const raw = await httpGet<RawSchool[]>("/locations");
      return mapSchools(raw); // validate before returning to UI
    },
  });

  return {
    schools: query.data, // Ref<School[] | undefined>
    loading: query.isLoading,
    error: query.isError,
    fetchSchools: query.refetch,
  };
}
