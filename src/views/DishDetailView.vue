<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Heart, MapPin, ArrowLeft, PenLine } from 'lucide-vue-next'
import { dishes } from '../data/campus'
import { getCanteen, getWindow, stats } from '../services/catalog'
import { useLocalData } from '../composables/useLocalData'
import FoodVisual from '../components/dish/FoodVisual.vue'
import RatingDisplay from '../components/dish/RatingDisplay.vue'
import ReviewCard from '../components/review/ReviewCard.vue'
import ReviewForm from '../components/review/ReviewForm.vue'
import EmptyState from '../components/common/EmptyState.vue'
const route = useRoute(),
  { reviews, favorites, toggleFavorite } = useLocalData()
const dish = computed(() => dishes.find((d) => d.id === route.params.id))
const list = computed(() => reviews.value.filter((r) => r.dishId === dish.value?.id))
const showForm = ref(false),
  expanded = ref(false)
watch(
  () => route.params.id,
  () => {
    showForm.value = false
    expanded.value = false
  },
)
</script>
<template>
  <RouterLink to="/explore" class="back-link"><ArrowLeft :size="15" />返回找菜</RouterLink
  ><template v-if="dish"
    ><section class="detail-hero">
      <div class="detail-image">
        <FoodVisual :dish="dish" large /><small>风格化食物示意插画 · 非实物照片</small>
      </div>
      <div class="detail-copy">
        <div class="eyebrow green">A LITTLE JOY ON YOUR PLATE</div>
        <h1>{{ dish.name }}</h1>
        <RouterLink :to="`/canteens/${getCanteen(dish).id}`" class="detail-location"
          ><MapPin :size="16" />{{ getCanteen(dish).name }} · {{ getWindow(dish).number }} 号窗口 ·
          {{ getWindow(dish).name }}</RouterLink
        >
        <div class="detail-rating">
          <RatingDisplay :score="stats(dish.id, reviews).score" :count="list.length" /><span
            class="demo-badge"
            >演示菜品</span
          >
        </div>
        <p>{{ dish.description }}</p>
        <div class="tags">
          <span v-for="tag in dish.tags" :key="tag">{{ tag }}</span>
        </div>
        <div class="detail-actions">
          <span class="detail-price"><small>¥</small>{{ dish.price }} <em>/ 份</em></span
          ><button
            class="button"
            :class="{ secondary: favorites.includes(dish.id) }"
            :aria-pressed="favorites.includes(dish.id)"
            @click="toggleFavorite(dish.id)"
          >
            <Heart :size="17" :fill="favorites.includes(dish.id) ? 'currentColor' : 'none'" />{{
              favorites.includes(dish.id) ? '已收藏' : '收藏这道菜'
            }}
          </button>
        </div>
        <p class="small-note">虚构菜单价格，仅用于产品演示；不提供在线下单。</p>
      </div>
    </section>
    <section class="review-section">
      <div class="section-heading">
        <div>
          <h2>
            吃过的同学说 <span class="heading-note">{{ list.length }} 条评价</span>
          </h2>
          <p class="muted">已有内容为模拟评价；你的评价仅在当前浏览器可见。</p>
        </div>
        <button class="button secondary" @click="showForm = !showForm">
          <PenLine :size="16" />写评价
        </button>
      </div>
      <ReviewForm v-if="showForm" :dish-id="dish.id" @close="showForm = false" /><ReviewCard
        v-for="r in expanded ? list : list.slice(0, 5)"
        :key="r.id"
        :review="r"
      /><button
        v-if="list.length > 5"
        class="text-button show-reviews"
        @click="expanded = !expanded"
      >
        {{ expanded ? '收起评价' : `查看全部 ${list.length} 条评价` }}
      </button>
    </section></template
  ><EmptyState
    v-else
    title="这道菜还没被雷达发现"
    description="菜品链接可能有误，去菜单里逛逛吧。"
    to="/explore"
  />
</template>
<style scoped>
.detail-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 45px;
  align-items: center;
}
.detail-image {
  border-radius: 20px;
  overflow: hidden;
  background: #f0e5d7;
  position: relative;
}
.detail-image > small {
  display: block;
  padding: 10px 15px;
  color: var(--muted);
  font-size: 10px;
}
.detail-copy h1 {
  font-size: 33px;
  line-height: 1.3;
  margin: 17px 0;
}
.detail-location {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--muted);
  font-size: 12px;
}
.detail-rating {
  display: flex;
  gap: 15px;
  align-items: center;
  margin: 23px 0;
}
.detail-copy > p {
  font-size: 13px;
  line-height: 1.9;
  color: var(--muted);
}
.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.tags span {
  font-size: 11px;
  background: #ecf0e4;
  color: #65774f;
  padding: 6px 10px;
  border-radius: 5px;
}
.detail-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  gap: 10px;
}
.detail-price {
  font-size: 38px;
  color: var(--orange);
  font-weight: 800;
}
.detail-price small {
  font-size: 20px;
}
.detail-price em {
  font-size: 12px;
  color: var(--muted);
  font-style: normal;
  font-weight: 400;
}
.detail-copy .small-note {
  font-size: 10px;
  margin-top: 15px;
}
.review-section {
  max-width: 840px;
  margin: 55px auto 0;
}
.muted {
  font-size: 11px;
  line-height: 1.7;
}
.show-reviews {
  display: block;
  margin: 25px auto;
}
.demo-badge {
  font-size: 10px;
  color: var(--muted);
  padding: 4px 6px;
  background: #eeeee5;
  border-radius: 4px;
}
@media (max-width: 760px) {
  .detail-hero {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  .detail-copy h1 {
    font-size: 29px;
  }
  .review-section {
    margin-top: 35px;
  }
  .review-section .section-heading {
    align-items: flex-start;
  }
  .review-section h2 {
    font-size: 20px;
  }
  .review-section .button {
    font-size: 11px;
    padding: 10px;
    white-space: nowrap;
  }
}
</style>
