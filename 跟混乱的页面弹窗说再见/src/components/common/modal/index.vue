<template>
  <transition name="modal">
    <div class="modal-bg" v-if="visible" @click="closeModal">
      <div class="modal-box">
        <h3 class="title">{{title}}</h3>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    title: {
      required: false,
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    closeModal () {
      this.visible = false
    }
  }
}
</script>

<style scoped>
  .modal-enter-active, .modal-leave-active {
    transition: opacity .2s linear;
  }
  .modal-enter, .modal-leave-to {
    opacity: 0;
  }
  .modal-bg {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 10;
  }
  .modal-box {
    position: fixed;
    left: 50%;
    top: 46%;
    width: 190px;
    border-radius: 16px;
    color: #333;
    box-sizing: border-box;
    text-align: center;
    transform: translate(-50%, -50%);
    background-color: #fff;
    z-index: 20;
  }
</style>
