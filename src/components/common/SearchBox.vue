<script setup lang="ts">
import { Search, ArrowRight } from 'lucide-vue-next'
defineProps<{ modelValue: string; compact?: boolean }>()
defineEmits<{ 'update:modelValue': [value: string]; submit: [] }>()
</script>
<template>
  <form class="search-box" :class="{ compact }" role="search" @submit.prevent="$emit('submit')">
    <Search :size="20" /><input
      :value="modelValue"
      aria-label="搜索菜品、窗口或食堂"
      placeholder="搜搜菜品、窗口，或你想念的味道…"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    /><button type="submit" aria-label="搜索">
      <span>找好吃的</span><ArrowRight :size="17" />
    </button>
  </form>
</template>
<style scoped>
.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 8px 8px 8px 18px;
  border: 1px solid #e9dfd0;
  border-radius: 13px;
  box-shadow: 0 4px 16px #5f3c1510;
  color: var(--muted);
}
input {
  border: 0;
  outline: 0;
  width: 100%;
  min-width: 0;
  background: none;
  font-size: 14px;
}
button {
  display: flex;
  gap: 9px;
  align-items: center;
  white-space: nowrap;
  background: var(--orange);
  color: #fff;
  border: 0;
  border-radius: 9px;
  padding: 14px 18px;
  font-weight: 650;
}
.compact {
  box-shadow: none;
  max-width: 650px;
}
@media (max-width: 480px) {
  button {
    padding: 13px;
  }
  button span {
    display: none;
  }
  input {
    font-size: 12px;
  }
}
</style>
