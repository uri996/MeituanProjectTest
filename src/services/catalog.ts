import { canteens, windows, dishes } from '../data/campus'
import type { Dish, Filters, Review } from '../types'
export const getWindow = (dish: Dish) => windows.find((w) => w.id === dish.windowId)!
export const getCanteen = (dish: Dish) => canteens.find((c) => c.id === getWindow(dish).canteenId)!
export function stats(dishId: string, reviews: Review[]) {
  const list = reviews.filter((r) => r.dishId === dishId)
  return {
    count: list.length,
    score: list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0,
    negative: list.filter((r) => r.rating <= 2).length,
  }
}
export function reviewTags(dishId: string, reviews: Review[]) {
  const counts = new Map<string, number>()
  reviews
    .filter((r) => r.dishId === dishId)
    .forEach((r) => {
      r.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1))
    })
  return [...counts]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([tag]) => tag)
}
export function searchDishes(filters: Filters, reviews: Review[], source = dishes) {
  const q = filters.query.trim().toLowerCase()
  const result = source.filter(
    (d) =>
      (!q ||
        [d.name, getWindow(d).name, getCanteen(d).name].some((v) => v.toLowerCase().includes(q))) &&
      (!filters.canteenId || getCanteen(d).id === filters.canteenId) &&
      d.price <= filters.maxPrice &&
      (!filters.flavor || d.flavors.includes(filters.flavor)) &&
      (!filters.category || d.category === filters.category),
  )
  return result.sort((a, b) =>
    filters.sort === 'price-asc'
      ? a.price - b.price
      : filters.sort === 'price-desc'
        ? b.price - a.price
        : stats(b.id, reviews).score - stats(a.id, reviews).score,
  )
}
export function ranking(mode: string, reviews: Review[]) {
  return [...dishes]
    .filter((d) => {
      const s = stats(d.id, reviews)
      return mode === 'new'
        ? d.isNew
        : mode === 'watch'
          ? s.count >= 8 && s.negative >= 3 && s.negative / s.count >= 0.3
          : s.count >= 5
    })
    .sort((a, b) => {
      const x = stats(a.id, reviews),
        y = stats(b.id, reviews)
      return mode === 'watch'
        ? y.negative / y.count - x.negative / x.count
        : (y.score * y.count + 4 * 5) / (y.count + 5) - (x.score * x.count + 4 * 5) / (x.count + 5)
    })
}
export function pickDish(pool: Dish[], previous?: string, random = Math.random): Dish | undefined {
  const candidates = pool.length > 1 ? pool.filter((d) => d.id !== previous) : pool
  return candidates[Math.floor(random() * candidates.length)]
}
