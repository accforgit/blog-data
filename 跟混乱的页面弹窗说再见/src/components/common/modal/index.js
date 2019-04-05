import Vue from 'vue'
import Modal from './index.vue'

const ModalConstructor = Vue.extend(Modal)
// 当前存在的实例，全局唯一即可
let instance = null

const setAnInstance = () => {
  if (!instance) {
    instance = new ModalConstructor({
      el: document.createElement('div')
    })
    document.body.appendChild(instance.$el)
  }
}

export const showModal = title => {
  setAnInstance()
  instance.title = title
  Vue.nextTick(() => {
    instance.visible = true
  })
}

export const hideModal = callback => {
  if (instance) {
    instance.visible = false
    callback && callback()
  }
}
