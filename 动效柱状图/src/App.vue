<template>
  <div id="app">
    <BarGraph :gfData="gfData"/>
  </div>
</template>

<script>
import BarGraph from './components/BarGraph.vue';

export default {
  name: 'app',
  data() {
    return {
      gfData: [
        { id: 'jiaju', name: '家具', value: '987' },
        { id: 'muying', name: '母婴', value: '230' },
        { id: 'shuma', name: '数码', value: '678' },
        { id: 'shouji', name: '手机', value: '888' },
        { id: 'other', name: '其他', value: '320' },
      ],
    };
  },
  components: {
    BarGraph,
  },
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
