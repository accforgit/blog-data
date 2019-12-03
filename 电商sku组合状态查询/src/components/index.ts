import { Component, Vue } from 'vue-property-decorator'
import SkuManage, { joinKVStr, joinAttrStr } from 'sku-manager'
import baseData from './mockData'

interface IEmptyMapItem {
  [propName: string]: Array<string>
}
interface ICurrentSelectSkuRst {
  currentRst?: {
    priceArr: Array<number>
    spuDIdArr: Array<string>
    totalCount: number
  }
  nextEmptyKV?: Array<string>
}

// 当前选择的 sku属性对应的库存、价格、spuDId等信息
let currentSelectSkuRst: ICurrentSelectSkuRst = {}
let skuManage: any = null

@Component
export default class Sku extends Vue {
  // #region data
  baseData = baseData
  // 应该置灰不可点击的按钮
  emptyMap: IEmptyMapItem = {}
  activeSkuTagMap: any = {}
  // 已经选中的属性信息
  hasSelectedList: Array<any> = []
  // 当前选中的 sku属性对应的价格
  // 当前选中的 sku属性总库存
  currentSeletedPrice: number = 0
  currentTotalCount: number = 0
  skuRankList: any = []
  // #endregion

  // #region lifeCycle
  created () {
    this.computeSkuData()
    skuManage = new SkuManage(baseData.skuParamVoList, this.skuRankList)
    this.activeSkuMapUpdate()
  }
  // #endregion

  // #region methods
  selectTag (paramId: string, valueId: string) {
    console.log('selectTag', paramId, valueId)
    if (this.emptyMap && this.emptyMap[paramId] && this.emptyMap[paramId].some(item => item === valueId)) {
      // 当前点击按钮已经被置灰，不做响应
      return
    }
    if (this.activeSkuTagMap[paramId] === valueId) {
      // 如果已经点选了，再次点选就取消点选
      this.$delete(this.activeSkuTagMap, paramId)
    } else {
      this.$set(this.activeSkuTagMap, paramId, valueId)
    }
    this.activeSkuMapUpdate()
  }
  // activeSkuMap 发生改变
  activeSkuMapUpdate () {
    currentSelectSkuRst = skuManage.excuteBySeleted(this.activeSkuTagMap)
    let hasSelectedList: Array<any> = []
    let valueInfo = null
    this.baseData.skuParamVoList.forEach((item: any) => {
      valueInfo = item.valueList.filter((v: any) => v.valueId === this.activeSkuTagMap[item.paramId])[0]
      if (valueInfo) {
        hasSelectedList.push({
          paramId: item.paramId,
          valueId: valueInfo.valueId,
          valueValue: valueInfo.valueValue
        })
      }
    })
    this.hasSelectedList = hasSelectedList
    this.emptyMap = this.getEmptyMap()
    // 取最低价格进行显示
    this.currentSeletedPrice = currentSelectSkuRst.currentRst ? (Math.min(...currentSelectSkuRst.currentRst.priceArr)) : 0
    this.currentTotalCount = currentSelectSkuRst.currentRst ? (currentSelectSkuRst.currentRst.totalCount) : 0
    console.log('tag change done:', this.emptyMap, currentSelectSkuRst)
  }
  // 获取库存为 0 的sku属性，依赖于 currentSelectSkuRst
  getEmptyMap () {
    let kv = null
    // key 为 paramId，值为以 valueId 组成的数组，在这个数组中的 valueId 就是需要置灰的
    const emptyMap: any = {}
    // ['10_100', '20_200']
    ;(currentSelectSkuRst.nextEmptyKV as Array<string>).forEach(item => {
      kv = item.split(joinKVStr)
      emptyMap[kv[0]] = (emptyMap[kv[0]] || []).concat(kv[1])
    })
    return emptyMap
  }
  computeSkuData () {
    let spudSortParams: any = null
    /* tslint:disable */
    this.skuRankList = Object.freeze(this.baseData.allSkuVoList.map(item => {
      // 按照 paramId 从小到大排序
      spudSortParams = item.spudParams.sort((a: any, b: any) => a.paramId - b.paramId)
      return {
        spuDId: item.spudId,
        paramIdJoin: spudSortParams.map((v: any) => v.paramId + joinKVStr + v.valueId).join(joinAttrStr),
        priceRange: [item.minPrice, item.maxPrice],
        count: +item.stock
      }
    }))
  }
  // #endregion
}
