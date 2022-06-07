<template>
<div class="home-box">
  <Astrolabe :data="data" />
  <hr>
  <div class="data-box">
    <ul class="ul-box planets">
      <li v-for="(p, key) in showData.planets" :key="key">
        <span class="name">{{ planetMap[p.planet_key].name }}：</span>
        <input type="text" v-model="p.angle">
      </li>
    </ul>
  </div>
  <div class="btn-box">
    <button @click="handleChange">确认改变行星角度(可用范围[0-1800])</button>
  </div>
</div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import Astrolabe from './components/astrolabe.vue'
import { planetMap, TAstrolabeData } from './components/vars'

const genData = () => {
  return {
    houses: [
      { in_key: 104, angle: 487 },
      { in_key: 105, angle: 431 },
      { in_key: 106, angle: 527 },
      { in_key: 107, angle: 728 },
      { in_key: 108, angle: 876 },
      { in_key: 97, angle: 809 },
      { in_key: 98, angle: 487 },
      { in_key: 99, angle: 431 },
      { in_key: 100, angle: 527 },
      { in_key: 101, angle: 728 },
      { in_key: 102, angle: 876 },
      { in_key: 103, angle: 809 },
    ],
    planets: [
      { planet_key: 65, in_key: 99, angle: 1281 },
      { planet_key: 66, in_key: 108, angle: 1333 },
      { planet_key: 67, in_key: 100, angle: 912 },
      { planet_key: 68, in_key: 98, angle: 335 },
      { planet_key: 69, in_key: 101, angle: 1424 },
      { planet_key: 70, in_key: 103, angle: 297 },
      { planet_key: 71, in_key: 108, angle: 20 },
      { planet_key: 72, in_key: 106, angle: 1281 },
      { planet_key: 73, in_key: 106, angle: 1232 },
      { planet_key: 74, in_key: 104, angle: 1403 },
      { planet_key: 76, in_key: 105, angle: 710 },
      { planet_key: 78, in_key: 101, angle: 1193 },
    ]
  } as TAstrolabeData
}

export default defineComponent({
  name: 'App',
  components: {
    Astrolabe,
  },
  setup() {
    const data = ref(genData())
    const showData = ref(genData())
    return {
      data,
      showData,
      planetMap,
      handleChange() {
        showData.value.planets.forEach(d => {
          d.angle = Number(d.angle)
        })
        data.value = JSON.parse(JSON.stringify(showData.value))
      }
    }
  }
})
</script>

<style lang="less">
html, body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.data-box {
  padding: 0 12px;
  .ul-box {
    padding: 0;
    margin: 0;
    li {
      display: inline-block;
      width: 160px;
      padding: 0;
      margin: 0;
      margin-bottom: 12px;
      list-style: none;
      input {
        width: 80px;
        border: 1px solid #ccc;
      }
    }
  }
}
.btn-box {
  padding: 0;
  height: 48px;
  button {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 48px;
    color: #fff;
    border: none;
    border-radius: 24px;
    background-color: #5c50a1;
  }
}
</style>
