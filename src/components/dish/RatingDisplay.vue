<script setup lang="ts">
import { Star } from 'lucide-vue-next'
defineProps<{ score: number; count?: number }>()
</script>
<template>
  <span class="rating"
    ><Star :size="14" fill="currentColor" /><strong>{{ score.toFixed(1) }}</strong
    ><small v-if="count !== undefined">{{ count }} 条评价</small></span
  >
</template>
<style scoped>
.rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #df7227;
  font-size: 13px;
}
.rating strong {
  font-size: 15px;
}
.rating small {
  color: var(--muted);
  font-size: 11px;
  margin-left: 4px;
  font-weight: 400;
}
</style>
