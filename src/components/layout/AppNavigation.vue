<script setup lang="ts">
import { Radar, House, Compass, ChartNoAxesColumnIncreasing, Heart, MapPin } from 'lucide-vue-next'
const links = [
  { to: '/', label: '今天吃什么', icon: House },
  { to: '/explore', label: '找好吃的', icon: Compass },
  { to: '/rankings', label: '校园榜单', icon: ChartNoAxesColumnIncreasing },
  { to: '/favorites', label: '我的收藏', icon: Heart },
]
</script>
<template>
  <a class="skip-link" href="#main-content">跳至主要内容</a>
  <header class="header">
    <div class="container nav-inner">
      <RouterLink to="/" class="brand"
        ><span class="brand-icon"><Radar :size="25" /></span
        ><span>食堂雷达<small>CANTEEN RADAR</small></span></RouterLink
      >
      <nav aria-label="主导航">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :exact-active-class="'active'"
          ><component :is="link.icon" :size="18" /><span>{{ link.label }}</span></RouterLink
        >
      </nav>
      <span class="campus"><MapPin :size="15" /> 青禾大学 <span class="demo">演示</span></span>
    </div>
  </header>
  <nav class="mobile-nav" aria-label="手机导航">
    <RouterLink v-for="link in links" :key="link.to" :to="link.to" exact-active-class="active"
      ><component :is="link.icon" :size="21" /><span>{{ link.label }}</span></RouterLink
    >
  </nav>
</template>
<style scoped>
.header {
  background: #fffdf9;
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 23px;
  font-weight: 850;
  white-space: nowrap;
}
.brand-icon {
  background: var(--orange);
  color: white;
  padding: 10px;
  border-radius: 14px;
  display: flex;
}
.brand small {
  display: block;
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--muted);
  margin-top: 3px;
}
.nav-inner nav {
  display: flex;
  gap: 30px;
}
.nav-inner nav a {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  color: var(--muted);
  padding: 32px 0;
  border-bottom: 3px solid transparent;
}
.nav-inner nav a.active {
  color: var(--orange);
  border-color: var(--orange);
  font-weight: 700;
}
.campus {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--muted);
}
.mobile-nav {
  display: none;
}
.demo {
  background: #eeeae2;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 10px;
}
@media (max-width: 760px) {
  .nav-inner {
    height: 72px;
  }
  .nav-inner nav {
    display: none;
  }
  .brand {
    font-size: 21px;
  }
  .campus {
    font-size: 11px;
  }
  .mobile-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fffdf9f5;
    border-top: 1px solid var(--border);
    z-index: 20;
    justify-content: space-around;
    padding: 10px 0 calc(10px + env(safe-area-inset-bottom));
    backdrop-filter: blur(15px);
  }
  .mobile-nav a {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    color: var(--muted);
  }
  .mobile-nav a.active {
    color: var(--orange);
    font-weight: 700;
  }
}
</style>
