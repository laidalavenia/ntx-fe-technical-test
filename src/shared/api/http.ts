import { ENV } from '@/shared/config/env'

// Thin fetch wrapper: prepends base URL and throws on non-2xx.
// Keeping it framework-agnostic so any composable can reuse it.
export async function httpGet<T>(path: string): Promise<T> {
  const res = await fetch(ENV.apiBase + path)
  if (!res.ok) {
    throw new Error('Request failed with status ' + res.status)
  }
  return res.json() as Promise<T>
}