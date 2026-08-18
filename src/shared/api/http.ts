import { ENV } from '@/shared/config/env'

export async function httpGet<T>(path: string): Promise<T> {
  const res = await fetch(ENV.apiBase + path)
  if (!res.ok) {
    throw new Error('Request failed with status ' + res.status)
  }
  return res.json() as Promise<T>
}