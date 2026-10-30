<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchBox from '../components/common/SearchBox.vue'
import EmptyState from '../components/common/EmptyState.vue'
import DishFilters from '../components/dish/DishFilters.vue'
import DishCard from '../components/dish/DishCard.vue'
import { searchDishes } from '../services/catalog'
import { useLocalData } from '../composables/useLocalData'
import type { Filters } from '../types'
const route = useRoute(),
  router = useRouter(),
  { reviews } = useLocalData()
const str = (v: unknown) => (typeof v === 'string' ? v : '')
const filters = computed<Filters>({
  get: () => ({
    query: str(route.query.q),
    canteenId: str(route.query.canteen),
    maxPrice: [10, 15, 20].includes(Number(route.query.budget)) ? Number(route.query.budget) : 100,
    flavor: str(route.query.flavor),
    category: str(route.query.category),
    sort: str(route.query.sort) || 'rating',
  }),
  set: (v) => {
    router.replace({
      query: {
        q: v.query || undefined,
        canteen: v.canteenId || undefined,
        budget: v.maxPrice === 100 ? undefined : v.maxPrice,
        flavor: v.flavor || undefined,
        category: v.category || undefined,
        sort: v.sort === 'rating' ? undefined : v.sort,
      },
    })
  },
})
const result = computed(() => searchDishes(filters.value, reviews.value))
const resultsHeading = ref<HTMLElement>()
async function showResults() {
  await nextTick()
  resultsHeading.value?.focus({ preventScroll: true })
  resultsHeading.value?.scrollIntoView({ block: 'center' })
}
function reset() {
  router.replace('/explore')
}
</script>
<template>
  <div class="page-header">
    <div class="eyebrow green">FIND YOUR NEXT BITE</div>
    <h1>好吃的，就在附近。</h1>
    <p>从一口想念的味道开始，找到今天的心仪一餐。</p>
  </div>
  <SearchBox
    :model-value="filters.query"
    compact
    @update:model-value="filters = { ...filters, query: $event }"
    @submit="showResults"
  /><DishFilters v-model="filters" />
  <div ref="resultsHeading" class="list-toolbar" tabindex="-1" aria-live="polite">
    <span
      >找到 <strong>{{ result.length }}</strong> 道好味 <small>· 演示菜单</small></span
    ><button class="text-button" @click="reset">重置筛选</button>
  </div>
  <div v-if="result.length" class="dish-grid">
    <DishCard v-for="dish in result" :key="dish.id" :dish="dish" />
  </div>
  <EmptyState v-else title="雷达暂时没搜到" description="换个关键词，或放宽预算和口味试试。"
    ><button class="button" @click="reset">清空条件，重新发现</button></EmptyState
  >
</template>
