<script setup lang="ts">
import type { Review } from '../../types'
import RatingDisplay from '../dish/RatingDisplay.vue'
defineProps<{ review: Review }>()
</script>
<template>
  <article class="review">
    <div class="review-heading">
      <span class="avatar">{{ review.source === 'local' ? '我' : '禾' }}</span>
      <div>
        <strong>{{ review.author }}</strong
        ><small
          >{{ review.date }} ·
          {{ review.source === 'demo' ? '演示评价' : '本机新增 · 仅自己可见' }}</small
        >
      </div>
      <RatingDisplay :score="review.rating" />
    </div>
    <p>{{ review.text }}</p>
    <div class="tags">
      <span v-for="tag in review.tags" :key="tag">{{ tag }}</span>
    </div>
  </article>
</template>
<style scoped>
.review {
  padding: 23px 0;
  border-bottom: 1px solid var(--border);
}
.review-heading {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 36px;
  height: 36px;
  background: #edf0e4;
  color: #6a7a51;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 13px;
}
.review-heading strong {
  font-size: 13px;
}
.review-heading small {
  display: block;
  color: var(--muted);
  font-size: 10px;
  margin-top: 5px;
}
.review-heading > .rating {
  margin-left: auto;
}
.review p {
  font-size: 13px;
  line-height: 1.9;
  overflow-wrap: anywhere;
}
.tags {
  display: flex;
  gap: 7px;
}
.tags span {
  font-size: 10px;
  padding: 5px 8px;
  background: #f4f3ec;
  border-radius: 5px;
  color: var(--muted);
}
</style>
