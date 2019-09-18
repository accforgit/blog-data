<template>
  <div id="app">
    <Sku />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Sku from './components/Sku.vue'

@Component({
  components: {
    Sku
  }
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
