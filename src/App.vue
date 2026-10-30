<script setup lang="ts">
import AppNavigation from './components/layout/AppNavigation.vue'
import LoadingState from './components/common/LoadingState.vue'
import { useLocalData } from './composables/useLocalData'
const { notice } = useLocalData()
</script>
<template>
  <AppNavigation />
  <main id="main-content" class="container">
    <RouterView v-slot="{ Component }">
      <component :is="Component" v-if="Component" />
      <LoadingState v-else />
    </RouterView>
  </main>
  <footer class="site-footer container">
    <span>◎ 食堂雷达 · 好好吃饭，天天发现</span
    ><span>虚构青禾大学 · 全站为演示数据 · 收藏与新增评价仅保存在本机</span>
  </footer>
  <Transition name="toast"
    ><div v-if="notice" class="toast" role="status">{{ notice }}</div></Transition
  >
</template>
