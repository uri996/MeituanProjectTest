<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { MapPin, Clock, ArrowLeft } from 'lucide-vue-next'
import { canteens, windows, dishes } from '../data/campus'
import DishCard from '../components/dish/DishCard.vue'
import EmptyState from '../components/common/EmptyState.vue'
const route = useRoute(),
  canteen = computed(() => canteens.find((c) => c.id === route.params.id)),
  items = computed(() => windows.filter((w) => w.canteenId === canteen.value?.id))
</script>
<template>
  <RouterLink to="/" class="back-link"><ArrowLeft :size="15" />返回首页</RouterLink
  ><template v-if="canteen"
    ><section class="canteen-intro" :style="{ background: canteen.color }">
      <div class="eyebrow">CAMPUS CANTEEN · 演示食堂</div>
      <h1>{{ canteen.name }}</h1>
      <h3>{{ canteen.subtitle }}</h3>
      <p>{{ canteen.description }}</p>
      <div class="canteen-info">
        <span><MapPin :size="15" />{{ canteen.location }}</span
        ><span><Clock :size="15" />演示营业时间 {{ canteen.hours }}</span>
      </div>
    </section>
    <nav class="window-nav" aria-label="窗口分类">
      <a v-for="w in items" :key="w.id" :href="`#${w.id}`">{{ w.category }} · {{ w.name }}</a>
    </nav>
    <section v-for="w in items" :id="w.id" :key="w.id" class="section window-section">
      <div class="section-heading">
        <div>
          <div class="eyebrow green">{{ w.number }} 号窗口 · {{ w.category }}</div>
          <h2>{{ w.name }}</h2>
        </div>
        <span class="muted">{{ dishes.filter((d) => d.windowId === w.id).length }} 道菜品</span>
      </div>
      <div class="dish-grid">
        <DishCard v-for="d in dishes.filter((d) => d.windowId === w.id)" :key="d.id" :dish="d" />
      </div></section></template
  ><EmptyState
    v-else
    title="这里还没有食堂"
    description="食堂链接可能有误，回首页继续探索吧。"
    to="/"
    action="回到首页"
  />
</template>
<style scoped>
.canteen-intro {
  padding: 38px;
  border-radius: 22px;
  position: relative;
}
.canteen-intro h1 {
  font-size: 38px;
  margin: 20px 0 12px;
}
.canteen-intro h3 {
  font-size: 17px;
  font-weight: 500;
}
.canteen-intro p {
  max-width: 660px;
  font-size: 13px;
  line-height: 2;
  color: #626858;
}
.canteen-info {
  display: flex;
  gap: 23px;
  flex-wrap: wrap;
  margin-top: 25px;
  font-size: 11px;
  color: #626858;
}
.canteen-info span {
  display: flex;
  align-items: center;
  gap: 7px;
}
.window-nav {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 25px;
}
.window-nav a {
  background: white;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 12px;
  padding: 10px 14px;
}
.window-nav a:hover {
  border-color: var(--orange);
  color: var(--orange);
}
.window-section {
  scroll-margin-top: 24px;
}
.muted {
  font-size: 12px;
}
@media (max-width: 600px) {
  .canteen-intro {
    padding: 25px;
  }
  .canteen-intro h1 {
    font-size: 32px;
  }
  .window-nav {
    gap: 8px;
  }
  .window-nav a {
    font-size: 10px;
    padding: 9px;
  }
}
</style>
