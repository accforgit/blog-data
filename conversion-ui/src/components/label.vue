
<template>
<div class="trans-label-box" ref="boxRef" :style="{
    left: left + 'px',
    bottom: bottom + 'px',
  }">
  <div class="trans-bg" :style="{
    transform: 'skewX(' + dipAngle + 'deg)'
  }"></div>
  <div class="label-content">
    <span class="label-title">转化率</span>
    <span class="label-percent">{{ percent }}%</span>
  </div>
</div>
</template>
<script lang="ts">
import { defineComponent, computed, reactive, toRefs, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'Label',
  props: {
    // 角度即可，例如 30 代表 30度
    dipAngle: {
      type: Number,
      default: 0
    },
    x1: {
      type: Number,
      default: 0
    },
    x2: {
      type: Number,
      default: 0
    },
    centerY: {
      type: Number,
      default: 0
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const boxRef = ref<HTMLDivElement>()

    const data = reactive({
      // 容器高度
      height: 0,
      // 容器宽度
      width: 0,
      diffX: computed(() => Math.tan(props.dipAngle) * props.centerY),
    })

    onMounted(() => {
      const clients = boxRef.value!.getBoundingClientRect()
      data.height = clients.height
      data.width = clients.width
    })

    return {
      ...toRefs(data),
      left: computed(() => (props.x1 + props.x2) / 2 - data.diffX - data.width / 2),
      bottom: computed(() => {
        const bottom = props.centerY - data.height / 2
        return bottom < 0 ? 0 : bottom
      }),
      boxRef
    }
  }
})
</script>
<style lang="less" scoped>
.trans-label-box {
  position: absolute;
  z-index: 10;
}
.trans-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(270deg, rgba(248, 250, 255, 0.95) 5.08%, rgba(255, 255, 255, 0.95) 100%);
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  z-index: 20;
}
.label-content {
  position: relative;
  padding: 10px 14px;
  font-size: 12px;
  z-index: 30;
  .label-title {
    margin-right: 8px;
    color: #86909C;
  }
  .label-percent {
    color: #194CE5;
  }
}
</style>
