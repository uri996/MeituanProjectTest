<script setup lang="ts">
import { ref } from 'vue'
import { Star } from 'lucide-vue-next'
import { useLocalData } from '../../composables/useLocalData'
const props = defineProps<{ dishId: string }>(),
  emit = defineEmits<{ close: [] }>()
const rating = ref(0),
  text = ref(''),
  tags = ref<string[]>([]),
  error = ref('')
const options = ['分量足', '值得再来', '性价比高', '口味偏咸', '出品不稳', '等待较久']
const { addReview } = useLocalData()
function submit() {
  if (!rating.value || text.value.trim().length < 5) {
    error.value = '请选择星级，并写下至少 5 个字的体验。'
    return
  }
  addReview({
    dishId: props.dishId,
    rating: rating.value,
    text: text.value.trim(),
    tags: tags.value,
  })
  emit('close')
}
</script>
<template>
  <form class="review-form" @submit.prevent="submit">
    <div class="section-heading">
      <h3>这一餐，吃得怎么样？</h3>
      <button type="button" class="text-button" @click="emit('close')">收起</button>
    </div>
    <p class="muted">评价仅保存在当前浏览器，不会发布给其他用户。</p>
    <div class="stars" role="group" aria-label="选择评分">
      <button
        v-for="n in 5"
        :key="n"
        type="button"
        :aria-label="`${n} 星`"
        :aria-pressed="rating === n"
        @click="rating = n"
      >
        <Star :size="30" :fill="n <= rating ? 'currentColor' : 'none'" /></button
      ><span>{{ rating ? `${rating} 星` : '点击星星评分' }}</span>
    </div>
    <div class="tag-picker">
      <button
        v-for="tag in options"
        :key="tag"
        type="button"
        :class="{ selected: tags.includes(tag) }"
        :aria-pressed="tags.includes(tag)"
        @click="tags = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]"
      >
        {{ tag }}
      </button>
    </div>
    <label for="review-text">写下你的真实感受</label
    ><textarea
      id="review-text"
      v-model="text"
      maxlength="500"
      minlength="5"
      rows="4"
      placeholder="口味、分量、等待时间…分享你的这一餐。"
    />
    <div class="form-bottom">
      <span>{{ text.length }} / 500</span><button class="button" type="submit">保存本机评价</button>
    </div>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
  </form>
</template>
<style scoped>
.review-form {
  background: #faf8f0;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 16px;
  margin: 20px 0;
}
.section-heading {
  margin: 0;
}
h3 {
  font-size: 17px;
  margin: 0;
}
.muted {
  font-size: 11px;
}
.stars {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 20px 0;
}
.stars button {
  border: 0;
  background: none;
  color: #e99a2f;
  padding: 3px;
}
.stars span {
  font-size: 12px;
  color: var(--muted);
  margin-left: 10px;
}
.tag-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}
.tag-picker button {
  background: white;
  border: 1px solid var(--border);
  padding: 8px 10px;
  border-radius: 7px;
  color: var(--muted);
  font-size: 11px;
}
.tag-picker button.selected {
  background: #fff0df;
  color: #c26927;
  border-color: #dfa675;
}
label {
  display: block;
  font-size: 12px;
  margin-bottom: 9px;
}
textarea {
  display: block;
  width: 100%;
  resize: vertical;
  border: 1px solid var(--border);
  background: white;
  border-radius: 9px;
  padding: 13px;
  font: inherit;
  font-size: 13px;
}
.form-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 13px;
  font-size: 11px;
  color: var(--muted);
}
.error {
  color: #b04d24;
  font-size: 12px;
}
</style>
