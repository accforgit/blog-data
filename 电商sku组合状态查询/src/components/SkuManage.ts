// 处理 sku选择问题
import { composeMN, composeMArrN, uniqueArr, intersectionSortArr, intersectionArr } from '../calculateUtil'

// #region interface
interface ISkuRankListItem {
  spuDId: string
  paramIdJoin: string
  priceRange: Array<string>
  count: number
}
interface ISkuParamItem {
  paramId: string
  paramValue: string
  valueList: Array<{
    valueId: string
    valueValue: string
  }>
}

interface IIndexKeyItemContent {
  spuDIdArr?: Array<string>
  priceArr?: Array<number>
  totalCount?: number
}
interface IIndexKeyItem {
  [propName: string]: {
    [propName: string]: IIndexKeyItemContent
  }
}

interface IKeyRankItem {
  [propName: string]: Array<number>
}

interface IActiveSpuTagMapItem {
  [propName: string]: string
}

// #endregion

// 用于连接数组下标的分隔符
export const joinKVStr = '_'
export const joinAttrStr = '__'
const joinAttrStrRe = new RegExp(joinAttrStr, 'g')
export default class SkuManage {
  // 全部 sku 排列组合的数据
  skuRankList: Array<ISkuRankListItem> = []
  // sku 的组合源
  skuParamVoList: Array<ISkuParamItem> = []
  // 在 skuRankList中，所有包含 sku 每一商品属性（例如黑色）的数据项的下标的集合
  // 例如：{ 10_100__20_200: [0, 1, 2, 3, 4, 5] }
  keyRankMap: IKeyRankItem = {}
  // 任意选择状态下的商品库存和价格信息 Map
  indexKeyInfoMap: IIndexKeyItem = {}
  // 当没有选择任何 sku属性时，库存为 0 的 sku属性
  // 即总库存为 0 的单个 sku属性
  // 例如：['10_100']，表示 paramId = 10，valueId = 100 的 sku属性库存为 0
  emptySkuMap: Array<string> = []
  // 所有库存为 0 的 sku中，包括的 sku属性的集合，用于优化算法
  // 例如，10_101__20_201的库存为 0，则此值为 ['10_101', '20_201']
  // 如果此数组长度为 0，说明不存在库存为 0 的 sku，后续就无需考虑置灰的情况，因为所有的 sku的库存都是大于 0 的，都是可选的
  emptySkuIncludeList: Array<string> = []

  constructor (skuParamVoList: Array<ISkuParamItem>, skuRankList: Array<ISkuRankListItem>) {
    /* eslint-disable-next-line */
    console.log('skuRankList', skuRankList)
    this.skuParamVoList = skuParamVoList
    this.skuRankList = skuRankList
    this.init()
  }
  init () {
    this.computeKeyRankMap()
    this.computeAllCaseInfo()
    this.skuRankList.forEach(item => {
      if (item.count === 0) {
        this.emptySkuIncludeList = this.emptySkuIncludeList.concat(item.paramIdJoin.split(joinAttrStr))
      }
    })
    this.emptySkuIncludeList = uniqueArr(this.emptySkuIncludeList)
    /* eslint-disable-next-line */
    console.log('emptySkuIncludeList:', this.emptySkuIncludeList)
    if (this.emptySkuIncludeList.length) {
      this.emptySkuMap = this.computeEmptyInfo(0)
      /* eslint-disable-next-line */
      console.log('this.emptySkuMap', this.emptySkuMap)
    }
  }
  excuteBySeleted (activeSpuTagMap: IActiveSpuTagMapItem) {
    // 从小到大排序
    const activeSpuTagMapKeyList = Object.keys(activeSpuTagMap).filter(item => activeSpuTagMap[item]).sort((a, b) => +a - +b)
    const activeSpuTagMapKVArr = this.getSelectedIndexKeyArr(activeSpuTagMap)
    // 没有选择任何 sku属性
    if (activeSpuTagMapKeyList.length === 0) {
      return {
        currentRst: null,
        nextEmptyKV: this.emptySkuMap
      }
    }
    const arrKeyCount = activeSpuTagMapKeyList.length
    // 取得当前条件对应的库存和价格
    const currentRst: IIndexKeyItemContent = this.indexKeyInfoMap[arrKeyCount - 1][activeSpuTagMapKVArr.join(joinAttrStr)]
    // 需要置灰的 sku属性
    let nextEmptyKV: Array<string> = []
    // 不需要考虑置灰的情况，直接返回
    // 如果当前所选的 sku属性，都不在 this.emptySkuMap 内，即选择的 sku属性都是有库存的，则说明无论下一步选择哪些 sku属性，都无需考虑置灰
    if (intersectionArr(this.emptySkuIncludeList, activeSpuTagMapKVArr).length === 0) {
      return {
        // 当前选中的sku属性按钮对应的库存和价格信息
        currentRst,
        nextEmptyKV: this.emptySkuMap
      }
    }
    // 取得置灰的属性信息
    for (let i = 0; i < activeSpuTagMapKeyList.length; i++) {
      const currentList = composeMN(activeSpuTagMapKeyList.length, i + 1)
      nextEmptyKV = nextEmptyKV.concat(currentList.reduce((t, item) => {
        const currentSpuTagMapKey = item.reduce((total, c) => {
          return total + activeSpuTagMapKeyList[c] + joinKVStr + activeSpuTagMap[activeSpuTagMapKeyList[c]] + joinAttrStr
        }, '').slice(0, -joinAttrStr.length)
        return t.concat(this.computeEmptyInfo(item.length, currentSpuTagMapKey))
      }, [] as string[]))
    }
    return {
      // 当前选中的sku属性按钮对应的库存和价格信息
      currentRst,
      // 应该置为灰色不可点击状态的按钮，需要加上当任何属性不选择是库存为 0 的属性
      nextEmptyKV: uniqueArr(nextEmptyKV.concat(this.emptySkuMap))
    }
  }
  // 计算在 skuRankList中，所有包含 sku 每一商品属性（例如黑色）的数据项的下标的集合
  computeKeyRankMap () {
    const skuRankList = this.skuRankList
    const skuRankListLen = skuRankList.length
    const skuParamVoListLen = this.skuParamVoList.length
    let valueItem = null
    let keyRankMapKey = null
    for (let i = 0; i < skuParamVoListLen; i++) {
      valueItem = this.skuParamVoList[i].valueList
      for (let j = 0; j < valueItem.length; j++) {
        keyRankMapKey = this.skuParamVoList[i].paramId + joinKVStr + valueItem[j].valueId
        for (let k = 0; k < skuRankListLen; k++) {
          if (skuRankList[k].paramIdJoin.includes(keyRankMapKey)) {
            if (!this.keyRankMap[keyRankMapKey]) {
              this.keyRankMap[keyRankMapKey] = []
            }
            this.keyRankMap[keyRankMapKey] = this.keyRankMap[keyRankMapKey].concat(k)
          }
        }
      }
    }
  }
  // 任意选择状态下的商品库存和价格信息
  // 例如，选中黑色 + 16G，计算出其对应的总库存和价格范围数据
  computeAllCaseInfo () {
    let caseCom: Array<Array<string>> = []
    let includeIndexArrTemp: Array<number> = []
    let priceArrTemp: Array<string> = []
    let countArrTemp: Array<number> = []
    let spuDIdTemp: Array<string> = []
    const mArr = this.skuParamVoList.map(item => item.valueList.length)
    const skuParamVoListLen = this.skuParamVoList.length
    for (let index = 0; index < skuParamVoListLen; index++) {
      this.indexKeyInfoMap[index] = {}
      caseCom = (composeMArrN(mArr, index + 1) as Array<Array<number>>).map((item: Array<number>) => {
        return item.reduce((t: Array<string>, c: number, kk: number) => {
          if (c === -1) return t
          // 需要按照 paramId 从小到大排序
          return this.sortByParamId(t, this.skuParamVoList[kk].paramId + joinKVStr + this.skuParamVoList[kk].valueList[c].valueId)
        }, [] as Array<string>)
      })
      caseCom.forEach(v => {
        priceArrTemp = []
        countArrTemp = []
        spuDIdTemp = []
        includeIndexArrTemp = intersectionSortArr(...v.map((vv: string) => (this.keyRankMap[vv] || [])))
        includeIndexArrTemp.forEach(item => {
          priceArrTemp = priceArrTemp.concat(this.skuRankList[item].priceRange)
          countArrTemp.push(this.skuRankList[item].count)
          spuDIdTemp.push(this.skuRankList[item].spuDId)
        })
        this.indexKeyInfoMap[index][v.join(joinAttrStr)] = {
          spuDIdArr: spuDIdTemp,
          // 转为数字
          priceArr: priceArrTemp.map(item => +item),
          totalCount: countArrTemp.reduce((t, c) => t + c, 0)
        }
      })
    }
    /* eslint-disable-next-line */
    console.log('computeAllCaseInfo done', this.indexKeyInfoMap)
  }
  /**
   * 当前选择状态下，再次选择时，库存为 0 的 sku属性，返回值例如：['20_201']
   * @param arrKeyCount 选中了几个sku属性
   * @param activeSpuTagMapKey 已经选中的sku属性，例如：'10_100'
   */
  computeEmptyInfo (arrKeyCount: number, activeSpuTagMapKey?: string) {
    let nextEmptyKV: Array<string> = []
    if (arrKeyCount === 0) {
      return Object.keys(this.indexKeyInfoMap[0]).filter(item => this.indexKeyInfoMap[0][item].totalCount === 0)
    }
    if (arrKeyCount >= this.skuParamVoList.length) {
      // 选择了全部 sku 属性
      return nextEmptyKV
    }
    const nextKeyMap = this.indexKeyInfoMap[arrKeyCount]
    const activeSpuTagList = (activeSpuTagMapKey as string).split(joinAttrStr)
    const activeSpuTagArrLen = activeSpuTagList.length
    const nextEmptyKeyArr: Array<string> = []
    Object.keys(nextKeyMap).forEach(item => {
      if (nextKeyMap[item].totalCount !== 0) return
      let i = 0
      const itemArr: string[] = item.split(joinAttrStr)
      itemArr.forEach(v => {
        if (v === activeSpuTagList[i]) i++
      })
      if (i === activeSpuTagArrLen) {
        nextEmptyKeyArr.push(item)
      }
    })
    if (nextEmptyKeyArr.length) {
      const activeSpuTagArr = (activeSpuTagMapKey as string).split(joinAttrStr)
      nextEmptyKV = uniqueArr(nextEmptyKeyArr.map(item => {
        // 删掉当前已经选中的，剩下的一个就是应该置灰的
        activeSpuTagArr.forEach(v => {
          item = item.replace(v, '')
        })
        return item.replace(joinAttrStrRe, '')
      }))
    }
    return nextEmptyKV
  }
  /**
   * 拼接已经选中的 sku属性
   * @param activeSpuTagMap 例如：{ 10:'101', 20: '201' }
   * @example { 10:'101', 20: '201' } => ['10_101', '20_201']
   */
  getSelectedIndexKeyArr (activeSpuTagMap: IActiveSpuTagMapItem): Array<string> {
    // paramId从小到大排序
    return Object.keys(activeSpuTagMap).filter(key => activeSpuTagMap[key]).sort((a, b) => +a - +b).map(key => {
      return key + joinKVStr + activeSpuTagMap[key]
    })
  }
  /**
   * 根据 paramId 从小到大的顺序，进行数组插入
   * @param arr 例如：['10_100', '30_300']
   * @param newKey 例如 '20_201'
   * @example sortByParamId(['10_100', '30_300'], '20_201') => ['10_100', '20_201', '30_300']
   */
  sortByParamId (arr: Array<string>, newKey: string) {
    const itemParamId = +newKey.split(joinKVStr)[0]
    let i = 0
    for (; i < arr.length; i++) {
      if (+arr[i].split(joinKVStr)[0] > itemParamId) {
        break
      }
    }
    arr.splice(i, 0, newKey)
    return arr
  }
}
