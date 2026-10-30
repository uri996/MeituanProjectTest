<template>
  <div class="loading" role="status"><span class="pulse" />雷达正在寻找好味道…</div>
</template>
<style scoped>
.loading {
  min-height: 45vh;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 14px;
}
.pulse {
  width: 16px;
  height: 16px;
  border: 2px solid #f0d9bd;
  border-top-color: var(--orange);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
