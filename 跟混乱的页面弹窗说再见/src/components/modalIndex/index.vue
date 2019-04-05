<template>
  <div class="main">
    <p>modalIndex</p>
    <child1 />
  </div>
</template>

<script>
import { showModal } from '../common/modal'
import child1 from './child1'
import modalMap from './modalMap'
import createModalManage from './modalManage'
import { api1, api2, api3 } from '../../api'

const modalManage = createModalManage('index')

export default {
  components: {
    child1
  },
  created () {
    const modalList = modalMap.index.modalList
    // 实际开发中，每个接口的数据逻辑应该都是不一样的，这里只是为了更直观地模拟多接口获取数据，只是一个占位表达
    this.initApi(api1, modalList[0])
    this.initApi(api2, modalList[1])
    this.initApi(api3, modalList[2])
  },
  methods: {
    initApi (apiName, modalItem) {
      apiName(modalItem).then(rst => {
        console.log('接口数据获取成功:', rst)
        // 接口的返回值控制弹窗的展示与否，所以加入弹窗管理实例中
        modalManage.add(modalItem.name, {
          level: modalItem.level,
          show: modalItem.show,
          handler: () => {
            console.log('弹窗展示：', modalItem)
            showModal(modalItem.name)
          }
        })
      })
    }
  }
}
</script>
