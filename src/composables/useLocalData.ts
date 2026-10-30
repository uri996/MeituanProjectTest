import { computed, ref } from 'vue'
import { demoReviews } from '../data/campus'
import { isFavorites, isReviews, readStorage, writeStorage } from '../services/storage'
import type { Review } from '../types'
const favorites = ref(readStorage('radar:favorites', [], isFavorites))
const localReviews = ref(readStorage('radar:reviews', [], isReviews))
const notice = ref('')
let timer: ReturnType<typeof setTimeout>
export function notify(message: string) {
  notice.value = message
  clearTimeout(timer)
  timer = setTimeout(() => (notice.value = ''), 3500)
}
export function useLocalData() {
  const reviews = computed(() => [...localReviews.value, ...demoReviews])
  function toggleFavorite(id: string) {
    const next = favorites.value.includes(id)
      ? favorites.value.filter((x) => x !== id)
      : [...favorites.value, id]
    favorites.value = next
    const ok = writeStorage('radar:favorites', next)
    notify(
      ok
        ? next.includes(id)
          ? '已加入收藏，下次不用再找啦'
          : '已取消收藏'
        : '浏览器存储不可用，本次操作仅在当前会话生效',
    )
  }
  function addReview(review: Omit<Review, 'id' | 'date' | 'source' | 'author'>) {
    const item: Review = {
      ...review,
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      date: new Date().toISOString().slice(0, 10),
      source: 'local',
      author: '我（本机）',
    }
    localReviews.value = [item, ...localReviews.value]
    const ok = writeStorage('radar:reviews', localReviews.value)
    notify(ok ? '评价已保存在本机，谢谢你的认真分享' : '浏览器存储不可用，评价仅在当前会话生效')
  }
  return { favorites, reviews, toggleFavorite, addReview, notice }
}
