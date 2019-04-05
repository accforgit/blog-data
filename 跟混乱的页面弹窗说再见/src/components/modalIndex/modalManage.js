import modalMap from './modalMap'
import { getAllModalList } from '../../util'

class ModalManage {
  constructor (modalList) {
    this.modalFlatMap = {}
    this.modalList = modalList
  }
  add (name, dataInfo) {
    // level, handler
    if (this.modalList.indexOf(name) !== -1) {
      if (!this.modalFlatMap[name]) {
        this.modalFlatMap[name] = dataInfo
        this.notify()
      } else {
        console.log('重复订阅')
      }
    } else {
      console.log('无效订阅')
    }
  }
  notify () {
    if (Object.keys(this.modalFlatMap).length === this.modalList.length) {
      console.log('弹窗状态全部初始化完毕')
      const highLevelModal = Object.keys(this.modalFlatMap).filter(key => this.modalFlatMap[key].show).reduce((t, c) => {
        return this.modalFlatMap[c].level > t.level ? this.modalFlatMap[c] : t
      }, { level: -1 })
      highLevelModal.handler()
    }
  }
}

// 单例管理
const manageTypeMap = {}
// 获取单例
function createModalManage (type) {
  if (!manageTypeMap[type]) {
    manageTypeMap[type] = new ModalManage(getAllModalList(modalMap[type]))
  }
  return manageTypeMap[type]
}

export default createModalManage
