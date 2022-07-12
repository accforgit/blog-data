<template>
<div class="wrapper">
  <CommonTable />
  <XStateTable />
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CommonTable from './common.vue'
import XStateTable from './xstate.vue'

export default defineComponent({
  components: {
    CommonTable,
    XStateTable,
  },
})
</script>
<style lang="less">
.wrapper {
  display: flex;
  justify-content: space-between;
  padding: 24px 66px;
}
.box {
  flex: 1;
  padding: 0 24px;
  .search-box {
    margin-bottom: 16px;
    text-align: right;
  }
}
</style>