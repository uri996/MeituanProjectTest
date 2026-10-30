<script setup lang="ts">
import { Soup } from 'lucide-vue-next'
defineProps<{ title: string; description: string; to?: string; action?: string }>()
</script>
<template>
  <div class="empty">
    <Soup :size="44" />
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <RouterLink v-if="to" :to="to" class="button">{{ action || '去找好吃的' }}</RouterLink
    ><slot />
  </div>
</template>
<style scoped>
.empty {
  text-align: center;
  padding: 65px 20px;
  background: white;
  border: 1px dashed var(--border);
  border-radius: 20px;
  color: var(--muted);
}
.empty > svg {
  color: var(--orange);
}
h2 {
  color: var(--text);
  font-size: 20px;
}
p {
  font-size: 14px;
  margin-bottom: 24px;
}
</style>
