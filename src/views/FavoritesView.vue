<script setup lang="ts">
import { computed } from 'vue'
import { dishes } from '../data/campus'
import { useLocalData } from '../composables/useLocalData'
import DishCard from '../components/dish/DishCard.vue'
import EmptyState from '../components/common/EmptyState.vue'
const { favorites } = useLocalData(),
  items = computed(() =>
    favorites.value.map((id) => dishes.find((d) => d.id === id)).filter((d) => !!d),
  )
</script>
<template>
  <div class="page-header">
    <div class="eyebrow green">SAVED WITH AN APPETITE</div>
    <h1>把喜欢的，留给下一餐。</h1>
    <p>你的私藏好味清单。收藏仅保存在当前浏览器，清理浏览器数据后会移除。</p>
  </div>
  <div v-if="items.length">
    <div class="list-toolbar">
      <span
        >已收藏 <strong>{{ items.length }}</strong> 道菜品</span
      ><span class="muted">点击爱心即可取消收藏</span>
    </div>
    <div class="dish-grid"><DishCard v-for="dish in items" :key="dish.id" :dish="dish" /></div>
  </div>
  <EmptyState
    v-else
    title="你的下一道心头好，还在路上"
    description="遇到想吃的菜，点一下爱心，就能在这里找到它。"
    to="/explore"
    action="去发现好吃的"
  />
</template>
