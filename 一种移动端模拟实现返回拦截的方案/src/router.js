import Vue from 'vue'
import VueRouter from 'vue-router'

import physicsBack from './components/physicsBack'

 Vue.use(VueRouter)

 const router = new VueRouter({
  routes: [{
    path: '/physicsBack/(footerModal)?',
    component: physicsBack
  }]
 })

 export default router