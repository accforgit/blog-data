import Vue from 'vue'
import Router from 'vue-router'
import FlyBall from '@/components/FlyBall/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FlyBall',
      component: FlyBall
    }
  ]
})
