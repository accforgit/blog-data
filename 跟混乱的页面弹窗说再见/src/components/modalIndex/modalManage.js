import modalMap from './modalMap'

const getAllConditionList = mapObj => {
  let currentList = []
  if (mapObj.modalList) {
    currentList = currentList.concat(
      mapObj.modalList.reduce((t, c) => t.concat(c.condition), [])
    )
  }
  if (mapObj.children) {
    currentList = currentList.concat(
      Object.values(mapObj.children).reduce((t, c) => {
        return t.concat(getAllConditionList(c))
      }, [])
    )
  }
  return currentList
}

const getModalItemByCondition = (condition, mapObj) => {
  let mapItem = null
  // 首先查找 modalList
  const isExist = (mapObj.modalList || []).some(item => {
    if (item.condition === condition || (Array.isArray(item.condition) && item.condition.includes(condition))) {
      mapItem = item
    }
    return mapItem
  })
  // modalList没找到，继续找 children
  if (!isExist) {
    Object.values(mapObj.children || []).some(mo => {
      mapItem = getModalItemByCondition(condition, mo)
      return mapItem
    })
  }
  return mapItem
}

class ModalManage {
  constructor (type) {
    this.type = type
    this.modalFlatMap = {}
    this.conditionList = getAllConditionList(modalMap[this.type])
    this.hasAddConditionList = []
    console.log('conditionList:', this.conditionList)
  }
  add (condition, infoObj) {
    console.log('add condition:', condition)
    if (!this.conditionList.includes(condition)) return console.log('无效订阅:', condition)
    if (this.hasAddConditionList.includes(condition)) return console.log('重复订阅:', condition)
    this.hasAddConditionList.push(condition)
    const modalItem = getModalItemByCondition(condition, modalMap[this.type])
    const existMap = this.modalFlatMap[modalItem.id]
    if (existMap) {
      console.log('existMap:', condition, existMap)
      // 说明当前弹窗由多个逻辑字段控制
      const handler = existMap.handler
      existMap.handler = () => {
        handler && handler()
        infoObj.handler && infoObj.handler()
      }
    } else {
      this.modalFlatMap[modalItem.id] = {
        level: modalItem.level,
        feShow: modalItem.feShow,
        rdShow: infoObj.rdShow,
        handler: infoObj.handler
      }
    }
    this.notify()
  }
  notify () {
    console.log('this.hasAddConditionList:', this.hasAddConditionList.length)
    if (this.hasAddConditionList.length === this.conditionList.length) {
      console.log('弹窗状态全部初始化完毕', this.modalFlatMap)
      const highLevelModal = Object.values(this.modalFlatMap).filter(item => item.rdShow && item.feShow).reduce((t, c) => {
        return c.level > t.level ? c : t
      }, { level: -1 })
      console.log('highLevelModal:', highLevelModal, highLevelModal.handler.toString())
      highLevelModal.handler && highLevelModal.handler()
    }
  }
}

// 单例管理
const manageTypeMap = {}
// 获取单例
function createModalManage (type) {
  if (!manageTypeMap[type]) {
    manageTypeMap[type] = new ModalManage(type)
  }
  return manageTypeMap[type]
}

export default createModalManage
