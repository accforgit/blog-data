<template>
<div class="conversion-box">
  <template v-for="(d, i) in treatedList" :key="i">
    <Parallelogram
      :style="{ marginRight: (i === treatedList.length - 1 ? 0 : gap) + 'px' }"
      :dipAngle="dipAngle"
      :height="d.height"
      :width="d.width"
      :skewXDistance="d.skewXDistance"
      :transFlag="i === 0 ? -1 : (i === treatedList.length - 1 ? 1 : 0)"
      :bg="d.bg"/>
    <Label
      v-if="i < treatedList.length - 1"
      :x1="d.rbx"
      :x2="treatedList[i + 1].lbx"
      :centerY="treatedList[i + 1].height / 2"
      :percent="d.percent"
      :dipAngle="dipAngle" />
    <Interim
      v-if="i < treatedList.length - 1"
      :left="d.rbx"
      :diffX1="d.skewXDistance"
      :r="r"
      :width="d.skewXDistance + gap + treatedList[i + 1].skewXDistance"
      :minHeight="treatedList[i].height"
      :maxHeight="treatedList[i + 1].height" />
  </template>
</div>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, ref, watch, computed } from 'vue'
import Parallelogram from './parallelogram.vue'
import Label from './label.vue'
import Interim from './interim.vue'

export default defineComponent({
  name: 'conversion',
  components: {
    Parallelogram,
    Label,
    Interim
  },
  props: {
    // 角度即可，例如 30 代表 30度
    dipAngle: {
      type: Number,
      required: true
    },
    // 两个平行四边形之间的间距
    gap: {
      type: Number,
      required: true
    },
    // 圆弧所在圆半径
    r: {
      type: Number,
      required: true
    },
    list: {
      type: Array as PropType<{
        width: number
        height: number
        percent: number
        bg: string
      }[]>,
      required: true
    }
  },
  setup(props) {
    return {
      treatedList: computed(() => {
        return props.list.map((l, index) => {
          const skewXDistance = Math.abs(l.height * Math.tan(props.dipAngle * Math.PI / 180))
          return {
            ...l,
            lbx: props.list.slice(0, index).reduce((t, c) => t + c.width + props.gap, 0),
            rbx: props.list.slice(0, index + 1).reduce((t, c) => t + c.width + props.gap, 0) - props.gap - skewXDistance,
            skewXDistance
          }
        })
      }),
    }
  }
})
</script>
<style lang="less" scoped>
.conversion-box {
  position: relative;
  font-size: 0;
  white-space: nowrap;
}
</style>