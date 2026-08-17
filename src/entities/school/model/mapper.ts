import type { RawSchool, School } from "./types";

// Map + validate: drop entries with invalid coordinates so the map won't break.
export function mapSchools(raw: RawSchool[]): School[] {
  const result: School[] = [];
  for (const item of raw) {
    const lat = Number(item.lat);
    const lng = Number(item.long);
    // Skip records without usable coordinates
    if (Number.isNaN(lat) || Number.isNaN(lng)) continue;
    if (lat === 0 && lng === 0) continue;
    result.push({
      npsn: item.npsn,
      name: item.school_name,
      stage: item.stage,
      status: item.status,
      province: item.province_name,
      city: item.city_name,
      district: item.district,
      address: item.street_name,
      lat,
      lng,
    });
  }
  return result;
}
