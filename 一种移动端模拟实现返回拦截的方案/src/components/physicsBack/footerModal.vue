<template>
  <transition name="fade">
    <div class="list" v-if="visible">
      <div class="list-item" v-for="(item, index) in dataList" :key="index">
        <img class="item-img" src="https://dummyimage.com/100x100/faaffa" alt="" />
        <p class="title">商品{{index}}</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      dataList: Array(10).fill(1)
    }
  }
}
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all .36s;
}
.fade-enter, .fade-leave-to {
  transform: translateY(100%);
}
.list {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 60vh;
  overflow: auto;
  background-color: #fff;
  z-index: 10;
}
.list-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #aaa;
}
.item-img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
</style>
