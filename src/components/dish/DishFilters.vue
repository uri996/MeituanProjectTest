<script setup lang="ts">
import type { Filters } from '../../types'
import { canteens, dishes } from '../../data/campus'
defineProps<{ modelValue: Filters }>()
const emit = defineEmits<{ 'update:modelValue': [value: Filters] }>()
const flavors = ['清淡', '咸香', '微辣', '香辣', '酸辣', '微甜']
function update(value: Filters, key: keyof Filters, event: Event) {
  emit('update:modelValue', {
    ...value,
    [key]:
      key === 'maxPrice'
        ? Number((event.target as HTMLSelectElement).value)
        : (event.target as HTMLSelectElement).value,
  })
}
</script>
<template>
  <div class="filters">
    <label
      >在哪吃<select
        :value="modelValue.canteenId"
        @change="update(modelValue, 'canteenId', $event)"
      >
        <option value="">全部食堂</option>
        <option v-for="c in canteens" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select></label
    ><label
      >花多少<select :value="modelValue.maxPrice" @change="update(modelValue, 'maxPrice', $event)">
        <option :value="100">不限预算</option>
        <option :value="10">10 元及以下</option>
        <option :value="15">15 元及以下</option>
        <option :value="20">20 元及以下</option>
      </select></label
    ><label
      >什么口味<select :value="modelValue.flavor" @change="update(modelValue, 'flavor', $event)">
        <option value="">全部口味</option>
        <option v-for="f in flavors" :key="f">{{ f }}</option>
      </select></label
    ><label
      >吃点什么<select
        :value="modelValue.category"
        @change="update(modelValue, 'category', $event)"
      >
        <option value="">全部类型</option>
        <option v-for="c in [...new Set(dishes.map((d) => d.category))]" :key="c">{{ c }}</option>
      </select></label
    ><label
      >怎么排序<select :value="modelValue.sort" @change="update(modelValue, 'sort', $event)">
        <option value="rating">评分优先</option>
        <option value="price-asc">价格从低到高</option>
        <option value="price-desc">价格从高到低</option>
      </select></label
    >
  </div>
</template>
<style scoped>
.filters {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
  padding: 24px;
  background: white;
  border: 1px solid var(--border);
  border-radius: 16px;
  margin: 24px 0;
}
label {
  display: flex;
  flex-direction: column;
  gap: 9px;
  font-size: 12px;
  color: var(--muted);
}
select {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 11px;
  background: var(--bg);
  color: var(--text);
  font: inherit;
  font-size: 13px;
}
@media (max-width: 760px) {
  .filters {
    grid-template-columns: repeat(2, 1fr);
    padding: 16px;
    gap: 14px;
  }
  .filters label:last-child {
    grid-column: span 2;
  }
}
</style>
