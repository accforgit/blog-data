<template>
  <p>child1_1</p>
</template>

<script>
import { showModal } from '../common/modal'
import modalMap from './modalMap'
import createModalManage from './modalManage'
import { api6 } from '../../api'

const modalManage = createModalManage('index')

export default {
  created () {
    const modalList = modalMap.index.children.child1.children.child1_1.modalList
    const modalList_1 = modalList[1]
    // 实际开发中，每个接口的数据逻辑应该都是不一样的，这里只是为了更直观地模拟多接口获取数据，只是一个占位表达
    this.initApi1(api6, modalList[0])
    this.initApi2(api6, modalList[0])
    // 代码逻辑直接控制弹窗的展示与否
    modalManage.add(modalList_1.condition, {
      rdShow: true,
      handler: () => {
        console.log('执行：', modalList_1)
        showModal(modalList_1.condition)
      }
    })
  },
  methods: {
    initApi1 (apiName, modalItem) {
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
    initApi2 (apiName, modalItem) {
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
    }
  }
}
</script>

