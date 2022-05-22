<template>
<div class="home-box">
  <button class="btn" @click="handleChange">随机改变比例和数量</button>
  <ConversionUI :dipAngle="dipAngle" :gap="gap" :r="roundR" :list="list" />
</div>
</template>
<script lang="ts">
import { defineComponent, ref, toRaw } from 'vue'
import ConversionUI from './components/conversion-ui.vue'

const bg = [
  'linear-gradient(263.69deg, #CCDCFF 16.82%, #EBF3FF 100.4%)',
  'linear-gradient(263.65deg, #8EADFF 11.79%, #C2D3FF 94.63%)',
  'linear-gradient(263.32deg, #5B8AFF 6.51%, #8DAEFF 93.96%)'
]  as const

const genList = () => {
  // 控制在 3-6 个
  const list = Array.from({ length: Math.floor(Math.round(Math.random() * 3) + 3) }).map((_, i) => ({
    width: 328,
    height: 100,
    percent: 0,
    bg: bg[i] || bg[bg.length - 1]
  }))
  for (let i = 0; i < list.length - 1; i++) {
    list[i].percent = Math.round(Math.random() * 80) + 10
    list[i + 1].height = list[i].percent / 100 * list[i].height
    // 最小控制为 2，不然就看不到了
    if (list[i + 1].height < 2) {
      list[i + 1].height = 2
    }
  }
  return list
}

export default defineComponent({
  name: 'App',
  components: {
    ConversionUI,
  },
  setup() {
    const list = ref(genList())
    return {
      dipAngle: -16,
      gap: 50,
      roundR: 90,
      list,
      handleChange() {
        list.value = genList()
        console.log('随机产生的数据：', toRaw(list.value))
      }
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 60px;
}
.btn {
  margin-bottom: 10px;
}
</style>
