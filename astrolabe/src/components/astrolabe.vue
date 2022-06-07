<template>
<div class="zhanxing-astrolabe-wrapper">
  <canvas id="astrolabe-canvas"></canvas>
</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, watch } from 'vue'
import { canvasImprove, clearCanvas } from './canvas'
import { draw } from './util'
import { TAstrolabeData } from './vars'

export default defineComponent({
  name: 'zhanxingAstrolabe',
  props: {
    data: {
      type: Object as PropType<TAstrolabeData>,
      required: true
    }
  },
  setup(props) {
    onMounted(() => {
      const canvas = document.getElementById('astrolabe-canvas') as HTMLCanvasElement
      const ctx = canvas.getContext('2d')!
      canvasImprove(canvas, ctx)
      watch([() => props.data], ([v]) => {
        clearCanvas(canvas, ctx)
        draw(ctx, v)
      }, { immediate: true })
    })
  }
})
</script>
