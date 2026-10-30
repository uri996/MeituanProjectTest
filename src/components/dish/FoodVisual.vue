<script setup lang="ts">
import type { Dish } from '../../types'
defineProps<{ dish: Dish; large?: boolean }>()
</script>
<template>
  <div
    class="food-visual"
    :class="{ large }"
    :style="{ background: dish.color }"
    role="img"
    :aria-label="`${dish.name}风格化示意插画，非实物照片`"
  >
    <span class="grain" /><span class="orbit orbit-a" /><span class="orbit orbit-b" /><span
      class="plate"
      ><span>{{ dish.emoji }}</span></span
    ><span class="sprig">✳</span><small>CAMPUS KITCHEN</small>
  </div>
</template>
<style scoped>
.food-visual {
  height: 183px;
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  isolation: isolate;
}
.grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath fill='%23000' opacity='.07' filter='url(%23n)' d='M0 0h180v180H0z'/%3E%3C/svg%3E");
  opacity: 0.4;
  z-index: -1;
}
.plate {
  width: 134px;
  height: 134px;
  border-radius: 50%;
  background: #fffdf3;
  display: grid;
  place-items: center;
  border: 10px solid #fffcf8;
  box-shadow:
    5px 12px 18px #69513a24,
    inset 0 0 0 2px #e9e4d5;
  transform: rotate(-12deg);
}
.plate > span {
  font-size: 78px;
  filter: drop-shadow(1px 5px 2px #663c2522);
  line-height: 1;
}
.orbit {
  width: 150px;
  height: 150px;
  border: 1px solid #ffffff70;
  border-radius: 50%;
  position: absolute;
  z-index: -1;
}
.orbit-a {
  left: -70px;
  top: -70px;
}
.orbit-b {
  right: -50px;
  bottom: -80px;
  width: 200px;
  height: 200px;
}
.sprig {
  position: absolute;
  right: 22px;
  top: 30px;
  color: #5e7759;
  font-size: 31px;
  transform: rotate(20deg);
}
small {
  position: absolute;
  bottom: 12px;
  left: 16px;
  font-size: 7px;
  letter-spacing: 2px;
  color: #7a715c;
}
.large {
  height: 360px;
}
.large .plate {
  width: 240px;
  height: 240px;
  border-width: 17px;
}
.large .plate > span {
  font-size: 140px;
}
.large .sprig {
  font-size: 60px;
  right: 12%;
  top: 20%;
}
@media (max-width: 480px) {
  .food-visual {
    height: 157px;
  }
  .plate {
    width: 112px;
    height: 112px;
  }
  .plate > span {
    font-size: 65px;
  }
  .sprig {
    right: 13px;
    font-size: 24px;
  }
  .large {
    height: 280px;
  }
}
</style>
