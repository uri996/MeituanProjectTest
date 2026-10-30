<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DishCard from '../components/dish/DishCard.vue'
import EmptyState from '../components/common/EmptyState.vue'
import { ranking, stats, reviewTags } from '../services/catalog'
import { useLocalData } from '../composables/useLocalData'
const route = useRoute(),
  router = useRouter(),
  { reviews } = useLocalData()
const tab = computed(() =>
  ['new', 'watch'].includes(String(route.query.tab)) ? String(route.query.tab) : 'good',
)
const items = computed(() => ranking(tab.value, reviews.value))
const tabs = [
  { id: 'good', title: '🏆 好评榜', subtitle: '经得起一口又一口' },
  { id: 'new', title: '✨ 尝鲜榜', subtitle: '给味蕾一点新鲜感' },
  { id: 'watch', title: '🔎 避雷观察', subtitle: '多看评价，少点遗憾' },
]
const rules = computed(() =>
  tab.value === 'watch'
    ? '观察规则：至少 8 条评价、至少 3 条低分（1–2 星），且低分占比达到 30%。按低分占比排序；仅提示出品波动，不代表每次体验。'
    : tab.value === 'new'
      ? '尝鲜规则：仅收录本周上新菜品；采用与好评榜相同的加权评分，平衡少量评价带来的波动。'
      : '好评规则：至少 5 条评价，按加权评分排序（加入 5 份 4 星先验），兼顾口碑与样本量。',
)
</script>
<template>
  <div class="page-header">
    <div class="eyebrow green">THE CAMPUS LIST</div>
    <h1>校园好味，有榜可循。</h1>
    <p>每一条认真评价，都让下一餐更有把握。</p>
  </div>
  <div class="ranking-tabs" role="tablist" aria-label="榜单分类">
    <button
      v-for="t in tabs"
      :key="t.id"
      role="tab"
      :aria-selected="tab === t.id"
      :class="{ active: tab === t.id }"
      @click="router.replace({ query: { tab: t.id } })"
    >
      <strong>{{ t.title }}</strong
      ><small>{{ t.subtitle }}</small>
    </button>
  </div>
  <p class="info-note">{{ rules }} 所有已有评价均为演示数据，本机新增评价也会参与计算。</p>
  <div class="list-toolbar">
    <span
      >{{ tabs.find((t) => t.id === tab)?.title }} <small>· {{ items.length }} 道菜品</small></span
    ><span class="quiet-label">根据当前演示与本机评价即时计算</span>
  </div>
  <div v-if="items.length" class="dish-grid">
    <div v-for="(dish, i) in items" :key="dish.id">
      <DishCard :dish="dish" :index="i + 1" />
      <div class="review-tags">
        <span v-for="tag in reviewTags(dish.id, reviews)" :key="tag">{{ tag }}</span>
      </div>
      <div v-if="tab === 'watch'" class="watch-detail">
        出品不稳 · {{ stats(dish.id, reviews).negative }} 条低分 /
        {{ stats(dish.id, reviews).count }} 条评价
      </div>
    </div>
  </div>
  <EmptyState
    v-else
    title="暂时没有符合规则的菜品"
    description="样本不足时不贸然下结论，先看看其他榜单吧。"
    to="/explore"
  />
</template>
<style scoped>
.review-tags {
  display: flex;
  gap: 7px;
  margin: 12px 0 0;
  flex-wrap: wrap;
}
.review-tags span {
  font-size: 10px;
  color: var(--green);
  background: #edf0e6;
  padding: 5px 8px;
  border-radius: 5px;
}
.ranking-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
.ranking-tabs button {
  text-align: left;
  border: 1px solid var(--border);
  background: white;
  border-radius: 14px;
  padding: 23px;
  color: var(--text);
}
.ranking-tabs strong {
  display: block;
  font-size: 18px;
}
.ranking-tabs small {
  display: block;
  font-size: 11px;
  color: var(--muted);
  margin-top: 10px;
}
.ranking-tabs button.active {
  background: #fff0e3;
  border-color: #eea46f;
  box-shadow: inset 0 0 0 1px #eea46f;
}
.watch-detail {
  font-size: 11px;
  color: #997044;
  padding: 12px 4px;
}
.quiet-label {
  font-size: 11px;
  color: var(--muted);
}
@media (max-width: 600px) {
  .ranking-tabs {
    gap: 8px;
  }
  .ranking-tabs button {
    padding: 16px 8px;
  }
  .ranking-tabs strong {
    font-size: 14px;
  }
  .ranking-tabs small {
    font-size: 9px;
  }
  .quiet-label {
    display: none;
  }
}
</style>
