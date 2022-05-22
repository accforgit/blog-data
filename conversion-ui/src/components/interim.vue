
<template>
<div class="ease-box" :style="{
    left: left + 'px',
    width: width + 'px',
    height: minHeight + 'px',
  }">
  <div class="ease-bg"></div>
  <div class="round" :style="{
    left: rLeft + 'px',
    top: rTop + 'px',
    width: r * 2 + 'px',
    height: r * 2 + 'px',

  }"></div>
</div>
</template>
<script lang="ts">
import { defineComponent, computed, toRefs, reactive } from 'vue'

/**
 * 计算圆心坐标
 * @param x1 圆上一点的x坐标
 * @param y1 圆上一点的y坐标
 * @param x2 圆上另一点的x坐标
 * @param y2 圆上另一点的y坐标
 * @param r 圆半径
 */
const genCircleCenter = (x1: number, y1: number, x2: number, y2: number, r: number) => {
  const c1 = (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1) / (2 * (x2 - x1))
  const c2 = (y2 - y1) / (x2 - x1)
  const A = c2 * c2 + 1
  const B = (2 * x1 * c2 - 2 * c1 * c2 - 2 * y1)
  const C = x1 * x1 - 2 * x1 * c1 + c1 * c1 + y1 * y1 - r * r
  // const y = (-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A)
  const y = (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A)
  return { x: c1 - c2 * y, y }
}

export default defineComponent({
  name: 'interim',
  props: {
    left: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    diffX1: {
      type: Number,
      default: 0
    },
    r: {
      type: Number,
      default: 0
    },
    minHeight: {
      type: Number,
      default: 0
    },
    maxHeight: {
      type: Number,
      default: 0
    },
  },
  setup(props) {
    const radiusXY = computed(() => genCircleCenter(props.width, props.minHeight - props.maxHeight, props.diffX1, 0, props.r))
    return {
      rLeft: computed(() => radiusXY.value.x - props.r),
      rTop: computed(() => radiusXY.value.y - props.r),
    }
  }
})
</script>
<style lang="less" scoped>
.ease-box {
  position: absolute;
  bottom: 0;
  overflow: hidden;
  .ease-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(281.19deg, rgba(55, 111, 255, 0.08) 4.91%, rgba(55, 111, 255, 0.04) 110.72%);
  }
  .round {
    position: absolute;
    border-radius: 50%;
    background-color: #fff;
  }
}
</style>
