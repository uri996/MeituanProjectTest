<script setup lang="ts">
import { Heart, MapPin } from 'lucide-vue-next'
import type { Dish } from '../../types'
import FoodVisual from './FoodVisual.vue'
import RatingDisplay from './RatingDisplay.vue'
import { getCanteen, getWindow, stats } from '../../services/catalog'
import { useLocalData } from '../../composables/useLocalData'
defineProps<{ dish: Dish; index?: number }>()
const { favorites, reviews, toggleFavorite } = useLocalData()
</script>
<template>
  <article class="dish-card">
    <div class="visual-wrap">
      <RouterLink :to="`/dishes/${dish.id}`" :aria-label="`查看${dish.name}`"
        ><FoodVisual :dish="dish" /></RouterLink
      ><span v-if="index" class="rank">{{ String(index).padStart(2, '0') }}</span
      ><span v-else-if="dish.isNew" class="new">本周新发现</span
      ><button
        class="favorite"
        :class="{ saved: favorites.includes(dish.id) }"
        :aria-label="`${favorites.includes(dish.id) ? '取消收藏' : '收藏'}${dish.name}`"
        :aria-pressed="favorites.includes(dish.id)"
        @click="toggleFavorite(dish.id)"
      >
        <Heart :size="17" :fill="favorites.includes(dish.id) ? 'currentColor' : 'none'" />
      </button>
    </div>
    <div class="dish-body">
      <RouterLink :to="`/dishes/${dish.id}`"
        ><div class="dish-title">
          <h3>{{ dish.name }}</h3>
          <span class="price"><small>¥</small>{{ dish.price }}</span>
        </div></RouterLink
      ><RouterLink :to="`/canteens/${getCanteen(dish).id}`" class="location"
        ><MapPin :size="11" />{{ getCanteen(dish).name }} · {{ getWindow(dish).name }}</RouterLink
      >
      <div class="card-bottom">
        <RatingDisplay
          :score="stats(dish.id, reviews).score"
          :count="stats(dish.id, reviews).count"
        /><span class="flavor">{{ dish.flavors[0] }}</span>
      </div>
    </div>
  </article>
</template>
<style scoped>
.dish-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 17px;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.dish-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px #42301d0b;
}
.visual-wrap {
  position: relative;
}
.favorite {
  position: absolute;
  right: 12px;
  top: 12px;
  border: 0;
  background: #fffdf4dc;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  color: #777565;
}
.favorite.saved {
  color: var(--orange);
}
.new {
  position: absolute;
  top: 13px;
  left: 12px;
  background: #fffdf2e8;
  color: #42684d;
  border-radius: 5px;
  padding: 5px 8px;
  font-size: 10px;
  font-weight: 650;
}
.rank {
  position: absolute;
  left: 12px;
  top: 12px;
  background: var(--orange);
  color: white;
  border-radius: 6px;
  padding: 5px 9px;
  font-weight: 800;
}
.dish-body {
  padding: 17px;
}
.dish-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
h3 {
  font-size: 16px;
  margin: 0;
  line-height: 1.5;
}
.price {
  color: var(--orange);
  font-size: 21px;
  font-weight: 800;
  white-space: nowrap;
}
.price small {
  font-size: 12px;
  margin-right: 2px;
}
.location {
  color: var(--muted);
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 9px 0 17px;
}
.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
}
.flavor {
  font-size: 10px;
  background: #f6f5ef;
  padding: 4px 7px;
  color: var(--muted);
  border-radius: 4px;
}
@media (max-width: 480px) {
  .dish-body {
    padding: 12px;
  }
  h3 {
    font-size: 13px;
  }
  .price {
    font-size: 18px;
  }
  .location {
    font-size: 9px;
  }
  .flavor {
    display: none;
  }
  .card-bottom :deep(.rating small) {
    font-size: 9px;
  }
}
</style>
