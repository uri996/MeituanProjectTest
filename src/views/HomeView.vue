<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowUpRight, ArrowRight, Shuffle, Sparkles, MapPin, Radar } from 'lucide-vue-next'
import SearchBox from '../components/common/SearchBox.vue'
import DishCard from '../components/dish/DishCard.vue'
import FoodVisual from '../components/dish/FoodVisual.vue'
import { dishes, canteens } from '../data/campus'
import { pickDish, searchDishes, ranking, getWindow, stats } from '../services/catalog'
import { useLocalData } from '../composables/useLocalData'
import type { Dish } from '../types'
const router = useRouter(),
  query = ref(''),
  budget = ref(100),
  flavor = ref(''),
  selected = ref<Dish>(),
  message = ref('')
const { reviews } = useLocalData()
const pool = computed(() =>
  searchDishes(
    {
      query: '',
      canteenId: '',
      maxPrice: budget.value,
      flavor: flavor.value,
      category: '',
      sort: 'rating',
    },
    reviews.value,
  ),
)
function decide() {
  selected.value = pickDish(pool.value, selected.value?.id)
  message.value = selected.value ? '' : '没有符合条件的菜，试试放宽预算或口味吧。'
}
function search() {
  router.push({
    path: '/explore',
    query: {
      q: query.value,
      budget: budget.value === 100 ? undefined : budget.value,
      flavor: flavor.value || undefined,
    },
  })
}
const recommendations = computed(() =>
  ranking('good', reviews.value)
    .filter((dish, i, all) => all.findIndex((d) => getWindow(d).id === getWindow(dish).id) === i)
    .slice(0, 4),
)
const hot = computed(() =>
  ranking('good', reviews.value)
    .sort((a, b) => stats(b.id, reviews.value).count - stats(a.id, reviews.value).count)
    .slice(0, 4),
)
</script>
<template>
  <div class="home">
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow"><span /> 校园干饭指南 · 每一餐都值得期待</div>
        <h1>今天吃什么？<br />让好吃的<span class="orange">找到你。</span></h1>
        <p>从纠结到开饭，只差一个食堂雷达。<br class="mobile-only" />发现校园里的每一口小确幸。</p>
        <SearchBox v-model="query" @submit="search" />
        <div class="hero-meta">
          <span>36 道校园好味</span><i /> <span>3 个食堂随心逛</span><i /><span>真实选餐体验</span>
        </div>
      </div>
      <div class="hero-art">
        <span class="scribble">HAVE A NICE MEAL!</span>
        <div class="hero-food"><FoodVisual :dish="dishes[4]!" large /></div>
        <div class="float-label label-one">✦ 今日幸福感 +1</div>
        <div class="float-label label-two">
          🍗 照烧鸡腿饭 <strong>¥15</strong><small>一食堂 · 饭点盖饭</small>
        </div>
        <span class="art-star">✳</span>
      </div>
    </section>
    <section class="decision">
      <div class="decision-heading">
        <span class="mini-icon"><Shuffle :size="22" /></span>
        <div>
          <h2>选择困难？交给雷达。</h2>
          <p>选个预算和口味，今天这顿有着落。</p>
        </div>
      </div>
      <div class="decision-controls">
        <label class="sr-only" for="budget">推荐预算</label
        ><select id="budget" v-model="budget" @change="selected = undefined">
          <option :value="100">💰 预算不限</option>
          <option :value="10">10 元以内</option>
          <option :value="15">15 元以内</option>
          <option :value="20">20 元以内</option></select
        ><label class="sr-only" for="flavor">推荐口味</label
        ><select id="flavor" v-model="flavor" @change="selected = undefined">
          <option value="">🥢 口味随意</option>
          <option v-for="f in ['清淡', '咸香', '微辣', '香辣', '酸辣', '微甜']" :key="f">
            {{ f }}
          </option></select
        ><button class="button" @click="decide"><Shuffle :size="16" />帮我决定吃什么</button>
      </div>
      <div v-if="selected" class="decision-result" aria-live="polite">
        <span class="result-emoji">{{ selected.emoji }}</span
        ><span
          >雷达为你找到：<strong>{{ selected.name }}</strong> · ¥{{ selected.price }}</span
        ><RouterLink :to="`/dishes/${selected.id}`">就吃这个 <ArrowRight :size="16" /></RouterLink
        ><button class="text-button" @click="decide">再换一道</button>
      </div>
      <p v-if="message" role="status">{{ message }}</p>
    </section>
    <section class="section">
      <div class="section-heading">
        <div>
          <div class="eyebrow green">PICKED FOR YOU</div>
          <h2>今日推荐 <span class="heading-note">好好吃饭，从这一餐开始</span></h2>
        </div>
        <RouterLink to="/explore" class="more-link"
          >发现更多 <ArrowUpRight :size="17"
        /></RouterLink>
      </div>
      <div class="dish-grid">
        <DishCard v-for="dish in recommendations" :key="dish.id" :dish="dish" />
      </div>
    </section>
    <section class="section campus-section">
      <div class="section-heading">
        <div>
          <div class="eyebrow green">AROUND THE CAMPUS</div>
          <h2>逛逛食堂 <span class="heading-note">熟悉的校园，还有新味道</span></h2>
        </div>
        <span class="quiet-label">青禾大学 · 虚构示例校园</span>
      </div>
      <div class="canteen-grid">
        <RouterLink
          v-for="(c, i) in canteens"
          :key="c.id"
          :to="`/canteens/${c.id}`"
          class="canteen-tile"
          :style="{ background: c.color }"
          ><span class="canteen-number">0{{ i + 1 }} / CAMPUS</span>
          <h3>{{ c.name }} <ArrowUpRight :size="20" /></h3>
          <p>{{ c.subtitle }}</p>
          <span class="canteen-location"><MapPin :size="12" />{{ c.location }}</span
          ><span class="building">{{ ['🏡', '🏫', '🌿'][i] }}</span></RouterLink
        >
      </div>
    </section>
    <section class="section">
      <div class="section-heading">
        <div>
          <div class="eyebrow green">CAMPUS FAVORITES</div>
          <h2>饭点人气王 <span class="heading-note">大家都在吃的校园好味</span></h2>
        </div>
        <RouterLink to="/rankings" class="more-link"
          >查看榜单 <ArrowUpRight :size="17"
        /></RouterLink>
      </div>
      <div class="dish-grid"><DishCard v-for="dish in hot" :key="dish.id" :dish="dish" /></div>
    </section>
    <div class="bottom-banners">
      <RouterLink to="/rankings?tab=new" class="discovery-banner"
        ><Sparkles :size="32" />
        <div>
          <h3>给味蕾放个小假</h3>
          <p>本周尝鲜清单，发现下一道心头好。</p>
        </div>
        <ArrowUpRight :size="23" /></RouterLink
      ><RouterLink to="/rankings?tab=watch" class="watch-banner"
        ><Radar :size="32" />
        <div>
          <h3>近期避雷观察</h3>
          <p>多看几条评价，让每一餐少点遗憾。</p>
        </div>
        <ArrowUpRight :size="23"
      /></RouterLink>
    </div>
    <div class="demo-note">
      小提示：这是一个可交互的产品演示，校园、菜品与已有评价均为虚构。食物插画仅作示意。
    </div>
  </div>
</template>
<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1.12fr 1fr;
  gap: 55px;
  align-items: center;
  padding: 55px 0 48px;
}
.eyebrow {
  font-size: 10px;
  font-weight: 650;
  letter-spacing: 1.5px;
  display: flex;
  align-items: center;
  gap: 7px;
}
.eyebrow > span {
  width: 6px;
  height: 6px;
  background: var(--green);
  border-radius: 50%;
}
h1 {
  font-size: clamp(35px, 4.3vw, 58px);
  line-height: 1.28;
  letter-spacing: -2px;
  margin: 20px 0;
}
.hero-copy > p {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.9;
  margin-bottom: 27px;
}
.hero-meta {
  display: flex;
  gap: 13px;
  align-items: center;
  font-size: 10px;
  color: #8d8a7b;
  margin-top: 18px;
}
.hero-meta i {
  width: 3px;
  height: 3px;
  background: #c6beaf;
  border-radius: 50%;
}
.hero-art {
  position: relative;
  padding: 25px;
}
.hero-food {
  border-radius: 45% 45% 38% 42%;
  overflow: hidden;
  transform: rotate(-8deg);
}
.hero-food :deep(.food-visual) {
  height: 330px;
  background: #ede4cf !important;
}
.hero-food :deep(.plate) {
  transform: rotate(15deg);
}
.scribble {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 20px;
  font-size: 12px;
  letter-spacing: 3px;
  transform: rotate(-8deg);
  color: #6d7f58;
  font-weight: 700;
}
.float-label {
  position: absolute;
  background: #fffef7;
  padding: 13px 17px;
  box-shadow: 0 7px 25px #735c2d15;
  border-radius: 12px;
  font-size: 13px;
}
.label-one {
  right: -5px;
  top: 53px;
  transform: rotate(8deg);
  font-weight: 600;
  color: var(--green);
}
.label-two {
  bottom: 13px;
  left: 0;
  transform: rotate(-4deg);
}
.label-two strong {
  color: var(--orange);
  margin-left: 15px;
}
.label-two small {
  display: block;
  color: var(--muted);
  font-size: 10px;
  margin: 6px 0 0 26px;
}
.art-star {
  position: absolute;
  bottom: 13px;
  right: 14px;
  color: var(--orange);
  font-size: 70px;
}
.decision {
  border: 1px solid #e9e5da;
  background: #fffdf6;
  border-radius: 17px;
  padding: 24px 27px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.decision-heading {
  display: flex;
  gap: 15px;
  align-items: center;
}
.mini-icon {
  display: grid;
  place-items: center;
  background: #fff0d9;
  color: #d48a2b;
  width: 46px;
  height: 46px;
  border-radius: 14px;
}
.decision h2 {
  font-size: 17px;
  margin: 0 0 7px;
}
.decision p {
  font-size: 11px;
  color: var(--muted);
  margin: 0;
}
.decision-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.decision select {
  border: 1px solid var(--border);
  background: white;
  border-radius: 8px;
  padding: 12px 10px;
  font-size: 12px;
  color: var(--text);
}
.decision-result {
  flex-basis: 100%;
  border-top: 1px dashed var(--border);
  padding-top: 18px;
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 13px;
  flex-wrap: wrap;
}
.decision-result a {
  color: var(--orange);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}
.result-emoji {
  font-size: 28px;
}
.canteen-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.canteen-tile {
  position: relative;
  overflow: hidden;
  padding: 24px;
  border-radius: 14px;
}
.canteen-number {
  font-size: 9px;
  letter-spacing: 2px;
  color: #716f5b;
}
.canteen-tile h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 21px;
  margin: 16px 0 9px;
}
.canteen-tile p {
  font-size: 11px;
  color: #6e705e;
  position: relative;
  z-index: 1;
}
.canteen-location {
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 9px;
  color: #727467;
  margin-top: 23px;
}
.building {
  position: absolute;
  right: 14px;
  bottom: 5px;
  font-size: 68px;
  opacity: 0.35;
  transform: rotate(-10deg);
}
.quiet-label {
  font-size: 10px;
  color: var(--muted);
}
.bottom-banners {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  margin-top: 42px;
}
.bottom-banners > a {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  border-radius: 15px;
}
.bottom-banners > a > svg:last-child {
  margin-left: auto;
}
.bottom-banners h3 {
  font-size: 17px;
  margin: 0 0 8px;
}
.bottom-banners p {
  font-size: 11px;
  margin: 0;
  color: var(--muted);
}
.discovery-banner {
  background: #eaf0e4;
  color: #57734a;
}
.watch-banner {
  background: #f5ecdf;
  color: #9c7540;
}
.demo-note {
  text-align: center;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.8;
  margin: 35px 0 0;
}
.mobile-only {
  display: none;
}
@media (max-width: 1000px) {
  .hero {
    gap: 20px;
  }
  .decision {
    justify-content: center;
  }
  .decision-heading {
    margin-right: auto;
  }
  .decision-controls {
    margin-right: auto;
  }
  .float-label {
    font-size: 11px;
  }
  .hero-art {
    padding: 15px;
  }
  .hero-food :deep(.food-visual) {
    height: 300px;
  }
}
@media (max-width: 760px) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 30px;
    gap: 20px;
  }
  .hero-art {
    max-width: 390px;
    width: 100%;
    margin: 0 auto;
  }
  .hero-food :deep(.food-visual) {
    height: 255px;
  }
  .hero-food :deep(.plate) {
    width: 190px;
    height: 190px;
  }
  .hero-food :deep(.plate > span) {
    font-size: 115px;
  }
  .hero-copy > p {
    font-size: 12px;
  }
  h1 {
    font-size: 43px;
  }
  .hero-meta {
    font-size: 9px;
  }
  .decision {
    padding: 20px 16px;
  }
  .decision-controls {
    width: 100%;
    flex-wrap: wrap;
  }
  .decision select {
    flex: 1;
    min-width: 0;
  }
  .decision-controls .button {
    width: 100%;
    justify-content: center;
  }
  .canteen-grid {
    grid-template-columns: 1fr;
  }
  .canteen-tile {
    padding: 20px;
  }
  .canteen-tile h3 {
    margin: 10px 0;
  }
  .canteen-location {
    margin-top: 16px;
  }
  .quiet-label {
    display: none;
  }
  .bottom-banners {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .bottom-banners > a {
    padding: 23px;
  }
  .heading-note {
    display: none;
  }
  .scribble {
    font-size: 10px;
  }
  .label-one {
    top: 30px;
  }
  .label-two {
    bottom: 0;
  }
  .art-star {
    font-size: 54px;
    bottom: 0;
  }
  .demo-note {
    text-align: left;
  }
  .hero-art {
    margin-top: 8px;
  }
  .mobile-only {
    display: block;
  }
}
</style>
