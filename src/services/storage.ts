import type { Review } from '../types'
export function readStorage<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const value: unknown = JSON.parse(raw)
    return validate(value) ? value : fallback
  } catch {
    return fallback
  }
}
export function writeStorage(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
export const isFavorites = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string')
export const isReviews = (v: unknown): v is Review[] =>
  Array.isArray(v) &&
  v.every(
    (r) =>
      r &&
      typeof r.id === 'string' &&
      typeof r.dishId === 'string' &&
      typeof r.author === 'string' &&
      typeof r.text === 'string' &&
      typeof r.date === 'string' &&
      r.source === 'local' &&
      Number.isInteger(r.rating) &&
      r.rating >= 1 &&
      r.rating <= 5 &&
      Array.isArray(r.tags) &&
      r.tags.every((t: unknown) => typeof t === 'string'),
  )
