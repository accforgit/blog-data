<template>
  <div class="physics-back">
    <button @click="changeVisible">展示 footerModal</button>
    <footerModal :visible="visible" />
    <transition name="mask-fade">
      <div class="mask" v-if="visible" @click="changeVisible"></div>
    </transition>
  </div>
</template>
<script>
import footerModal from './footerModal.vue'

export default {
  components: {
    footerModal
  },
  data () {
    return {
      visible: false
    }
  },
  watch: {
    $route (to, from) {
      this.manageFooterModal(to.path, from.path)
    }
  },
  created () {
    this.manageFooterModal(this.$route.path, '')
  },
  methods: {
    changeVisible () {
      if (this.visible) {
        this.$router.go(-1)
      } else {
        this.$router.push('/physicsBack/footerModal')
      }
    },
    manageFooterModal (toPath, fromPath) {
      if (toPath === '/physicsBack/footerModal') {
        this.visible = true
      } else if (fromPath === '/physicsBack/footerModal') {
        this.visible = false
      }
    }
  }
}
</script>

<style scoped>
.mask-fade-enter-active, .mask-fade-leave-active {
  transition: opacity .36s;
}
.mask-fade-enter, .mask-fade-leave-to {
  opacity: 0;
}
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 6;
}
</style>