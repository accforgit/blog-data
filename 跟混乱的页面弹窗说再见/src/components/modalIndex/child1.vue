<template>
  <div class="child1">
    <p>child1</p>
    <child11 />
  </div>
</template>

<script>
import { showModal } from '../common/modal'
import child11 from './child1_1'
import modalMap from './modalMap'
import createModalManage from './modalManage'
import { api4, api5 } from '../../api'

const modalManage = createModalManage('index')

export default {
  components: {
    child11
  },
  created () {
    const modalList = modalMap.index.children.child1.modalList
    // 实际开发中，每个接口的数据逻辑应该都是不一样的，这里只是为了更直观地模拟多接口获取数据，只是一个占位表达
    this.initApi1(api4, modalList[0])
    this.initApi2(api5, modalList[1])
    this.initApi3(api5, modalList[1])
    this.initApi4(api5, modalList[1])
  },
  methods: {
    initApi1 (apiName, modalItem) {
      apiName(modalItem).then(rst => {
        console.log('接口数据获取成功:', rst)
        // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
        modalManage.add(modalItem.condition, {
          rdShow: rst.rdShow,
          handler: () => {
            console.log('弹窗展示：', modalItem)
            showModal(modalItem.condition)
          }
        })
      })
    },
    initApi2 (apiName, modalItem) {
      apiName(modalItem).then(rst => {
        console.log('接口数据获取成功:', rst)
        // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
        modalManage.add(modalItem.condition[0], {
          rdShow: rst.rdShow,
          handler: () => {
            console.log('弹窗展示：', modalItem)
            showModal(modalItem.condition)
          }
        })
      })
    },
    initApi3 (apiName, modalItem) {
      apiName(modalItem).then(rst => {
        console.log('接口数据获取成功:', rst)
        // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
        modalManage.add(modalItem.condition[1], {
          rdShow: rst.rdShow,
          handler: () => {
            console.log('弹窗展示：', modalItem)
            showModal(modalItem.condition)
          }
        })
      })
    },
    initApi4 (apiName, modalItem) {
      modalItem.forceTrue = false
      apiName(modalItem).then(rst => {
        console.log('接口数据获取成功:', rst)
        // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
        modalManage.add(modalItem.condition[2], {
          rdShow: rst.rdShow,
          handler: () => {
            console.log('弹窗展示：', modalItem)
            showModal(modalItem.condition)
          }
        })
      })
    }
  }
}
</script>
