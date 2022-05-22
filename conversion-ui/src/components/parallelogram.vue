<template>
<div class="parallelogram-wrapper" :style="{
  height: height + 'px',
  width: width + 'px',
  overflow: transFlag === 0 ? 'visible' : 'hidden'
}">
  <div class="parallelogram-box" :style="{
    height: height + 'px',
    width: realWidth + 'px',
    transform: 'skewX(' + dipAngle + 'deg) translateX(' + (transFlag ? transFlag * skewXDistance / 2 : skewXDistance / 2) + 'px)',
    background: bg
  }"></div>
</div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'parallelogram',
  props: {
    // 角度即可，例如 30 代表 30度
    dipAngle: {
      type: Number,
      default: 0
    },
    // 倾斜过后的高（和倾斜前实际上是一样的）
    height: {
      type: Number,
      default: 0
    },
    // 倾斜过后的宽（即最左短点到最右短点的距离）
    width: {
      type: Number,
      default: 0
    },
    // 平行四边形单个倾斜角相对于原长方形在x轴上的偏移量
    skewXDistance: {
      type: Number,
      default: 0
    },
    bg: {
      type: String,
      default: "transparent"
    },
    // -1代表左边需要遮挡
    // 1代表左边需要遮挡
    // 0 代表不需要遮挡
    transFlag: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    return {
      realWidth: computed(() => props.width - (props.transFlag ? 0 : props.skewXDistance)),
    }
  }
})
</script>
<style lang="less" scoped>
.parallelogram-wrapper {
  position: relative;
  display: inline-block;
  vertical-align: bottom;
  overflow: hidden;
  z-index: 1;
}
.parallelogram-wrapper, .parallelogram-box {
  border-radius: 4px;
}
.parallelogram-box {
  border-bottom-right-radius: 0;
}
</style>