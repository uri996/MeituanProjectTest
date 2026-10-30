import { describe, it, expect, vi, afterEach } from 'vitest'
import { canteens, windows, dishes, demoReviews } from '../data/campus'
import { getCanteen, getWindow, searchDishes, ranking, pickDish, stats } from './catalog'
import { readStorage, writeStorage, isFavorites, isReviews } from './storage'
import type { Filters, Review } from '../types'
const filters: Filters = {
  query: '',
  canteenId: '',
  maxPrice: 100,
  flavor: '',
  category: '',
  sort: 'rating',
}
describe('校园数据完整性', () => {
  it('所有 ID 唯一且关联有效', () => {
    for (const table of [canteens, windows, dishes, demoReviews])
      expect(new Set(table.map((x) => x.id)).size).toBe(table.length)
    expect(canteens).toHaveLength(3)
    expect(windows).toHaveLength(9)
    expect(dishes).toHaveLength(36)
    windows.forEach((w) => expect(canteens.some((c) => c.id === w.canteenId)).toBe(true))
    dishes.forEach((d) => {
      expect(getWindow(d)).toBeTruthy()
      expect(getCanteen(d)).toBeTruthy()
      expect(d.price).toBeGreaterThan(0)
    })
    demoReviews.forEach((r) => {
      expect(dishes.some((d) => d.id === r.dishId)).toBe(true)
      expect(r.rating).toBeGreaterThanOrEqual(1)
      expect(r.rating).toBeLessThanOrEqual(5)
    })
  })
})
describe('搜索筛选与推荐', () => {
  it('支持菜品、窗口和食堂名', () => {
    expect(searchDishes({ ...filters, query: '番茄' }, demoReviews)).toHaveLength(2)
    expect(searchDishes({ ...filters, query: '一碗好面' }, demoReviews)).toHaveLength(4)
    expect(searchDishes({ ...filters, query: '湖畔食堂' }, demoReviews)).toHaveLength(12)
  })
  it('组合筛选与价格排序正确', () => {
    const result = searchDishes(
      { ...filters, canteenId: 'c2', maxPrice: 15, flavor: '清淡', sort: 'price-asc' },
      demoReviews,
    )
    expect(result.length).toBeGreaterThan(0)
    result.forEach((d) => {
      expect(getCanteen(d).id).toBe('c2')
      expect(d.price).toBeLessThanOrEqual(15)
      expect(d.flavors).toContain('清淡')
    })
    expect(result.map((d) => d.price)).toEqual(result.map((d) => d.price).sort((a, b) => a - b))
  })
  it('空结果安全，随机推荐遵守候选集且尽量不连续重复', () => {
    expect(pickDish([])).toBeUndefined()
    expect(pickDish([dishes[0]!], dishes[0]!.id)).toBe(dishes[0])
    expect(pickDish(dishes, dishes[0]!.id, () => 0)).toBe(dishes[1])
    expect(searchDishes({ ...filters, query: '不存在的菜' }, demoReviews)).toEqual([])
  })
})
describe('榜单可信度', () => {
  it('观察榜满足样本量、低分数量和占比规则', () => {
    const result = ranking('watch', demoReviews)
    expect(result).toHaveLength(3)
    result.forEach((d) => {
      const s = stats(d.id, demoReviews)
      expect(s.count).toBeGreaterThanOrEqual(8)
      expect(s.negative).toBeGreaterThanOrEqual(3)
      expect(s.negative / s.count).toBeGreaterThanOrEqual(0.3)
    })
  })
  it('一条差评不会被列入观察，尝鲜榜只包含新品', () => {
    const review: Review = { ...demoReviews[0]!, rating: 1 }
    expect(ranking('watch', [review])).toHaveLength(0)
    expect(ranking('new', demoReviews).every((d) => d.isNew)).toBe(true)
  })
})
describe('本地存储容错', () => {
  afterEach(() => vi.unstubAllGlobals())
  it('禁用、损坏或格式不合法时安全降级', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw Error('disabled')
      },
      setItem: () => {
        throw Error('quota')
      },
    })
    expect(readStorage('x', [], isFavorites)).toEqual([])
    expect(writeStorage('x', [])).toBe(false)
    vi.stubGlobal('localStorage', { getItem: () => '{broken' })
    expect(readStorage('x', [], isFavorites)).toEqual([])
    vi.stubGlobal('localStorage', { getItem: () => '[1,2]' })
    expect(readStorage('x', [], isFavorites)).toEqual([])
    expect(isReviews([{ source: 'local', rating: 5 }])).toBe(false)
  })
  it('有效数据可读写且评价来源严格区分', () => {
    const setItem = vi.fn()
    vi.stubGlobal('localStorage', { getItem: () => '["d1"]', setItem })
    expect(readStorage('x', [], isFavorites)).toEqual(['d1'])
    expect(writeStorage('x', ['d2'])).toBe(true)
    expect(setItem).toHaveBeenCalledWith('x', '["d2"]')
    expect(isReviews([{ ...demoReviews[0], source: 'local' }])).toBe(true)
    expect(isReviews([demoReviews[0]])).toBe(false)
  })
})
