type TMouseEventListener = (this: HTMLElement, ev: MouseEvent) => any
type TCallback = () => void
type TToggleEles = {
  moveStart?: TCallback
  moveEnd?: TCallback
  direction: EDirection
  list: { moveData?: { ele: HTMLElement; effect: EMoveEffect }[]; minHeight?: number; minWidth?: number; containerEle: HTMLElement }[]
}
export enum EMoveEffect {
  /** ele 向下拖拽的时候，所在的容器高度是变大；ele 向右拖拽的时候，所在的容器宽度是变大 */
  Expand,
  /** ele 向下拖拽的时候，所在的容器高度是变小；ele 向右拖拽的时候，所在的容器宽度是变小 */
  Shrink
}
export enum EDirection {
  /** 上下移动 */
  V, 
  /** 左右移动 */
  H
}

export default class Resize {
  private elesLength = 0
  private mousedownElesListeners: { ele: HTMLElement; fn: TMouseEventListener }[] = []
  private mouseActiveIndex = -1
  private mouseActiveEleIndex = -1
  private eleSizes: { width: number; height: number }[] = []
  private prevPageY = -1
  private prevPageX = -1

  constructor(private eles: TToggleEles) {
    this.elesLength = eles.list.length
    this.upListener = this.upListener.bind(this)
    this.registerListeners()
  }

  private registerListeners() {
    this.eles.list.forEach((ele, i) => {
      ((ele, i) => {
        const downListener = (moveEle: HTMLElement, eleIndex: number) => {
          const fn = (e: MouseEvent) => {
            if (!ele.moveData) return
            this.eles.moveStart?.()
            this.mouseActiveIndex = i
            this.mouseActiveEleIndex = eleIndex
            this.eleSizes = this.eles.list.map(data => ({ width: data.containerEle.offsetWidth, height: data.containerEle.offsetHeight }))
            this.prevPageY = e.pageY
            this.prevPageX = e.pageX
            document.addEventListener('mousemove', this.moveListener)
            document.addEventListener('mouseup', this.upListener)
          }
          this.mousedownElesListeners.push({ ele: moveEle, fn })
          return fn
        }
        ele.moveData?.forEach((d, eleIndex) => d.ele.addEventListener('mousedown', downListener(d.ele, eleIndex)))
      })(ele, i)
    })
  }
  private moveListener = (e: MouseEvent) => {
    if (this.mouseActiveIndex === -1) return
    if (this.eles.direction === EDirection.V) {
      const diffY = this.prevPageY - e.pageY
      this.prevPageY = e.pageY
      this.pullEffect(diffY, false)
    } else {
      const diffX = this.prevPageX - e.pageX
      this.prevPageX = e.pageX
      this.pullEffect(diffX, true)
    }
  }
  private upListener() {
    this.mouseActiveIndex = -1
    this.eles.moveEnd?.()
    document.removeEventListener('mouseup', this.upListener)
    document.removeEventListener('mousemove', this.moveListener)
  }
  private pullEffect(diff: number, isHorizontal: boolean) {
    if (diff === 0) return
    if (diff < 0) {
      if (this.eles.list[this.mouseActiveIndex].moveData![this.mouseActiveEleIndex].effect === EMoveEffect.Shrink) {
        this.pullEffectShrink(diff, isHorizontal, this.mouseActiveIndex)
      } else {
        this.pullEffectShrink(diff, isHorizontal, this.mouseActiveIndex + 1)
      }
    } else {
      if (this.eles.list[this.mouseActiveIndex].moveData![this.mouseActiveEleIndex].effect === EMoveEffect.Shrink) {
        this.pullEffectExpand(diff, isHorizontal, this.mouseActiveIndex)
      } else {
        this.pullEffectExpand(diff, isHorizontal, this.mouseActiveIndex + 1)
      }
    }
  }
  private pullEffectShrink(diff: number, isHorizontal: boolean, activeIndex: number) {
    let rest = diff
    const minSizeName = isHorizontal ? 'minWidth' : 'minHeight'
    const sizeName = isHorizontal ? 'width' : 'height'
    const containerEleIndex = activeIndex - 1
    const containerEle = this.eles.list[containerEleIndex].containerEle
    for (let index = activeIndex; index < this.elesLength; index++) {
      const ele = this.eles.list[index]
      const size = this.eleSizes[index][sizeName]
      if (size + rest < ele[minSizeName]!) {
        const maxDiff = size - ele[minSizeName]!
        rest = rest + maxDiff
        this.eleSizes[containerEleIndex][sizeName] += maxDiff
        this.eleSizes[index][sizeName] -= maxDiff
        containerEle.style[sizeName] = this.eleSizes[containerEleIndex][sizeName] + 'px'
        ele.containerEle.style[sizeName] = this.eleSizes[index][sizeName] + 'px'
      } else {
        this.eleSizes[containerEleIndex][sizeName] -= rest
        this.eleSizes[index][sizeName] += rest
        containerEle.style[sizeName] = this.eleSizes[containerEleIndex][sizeName] + 'px'
        ele.containerEle.style[sizeName] = this.eleSizes[index][sizeName] + 'px'
        break
      }
    }
  }
  private pullEffectExpand(diff: number, isHorizontal: boolean, activeIndex: number) {
    let rest = diff
    const containerEleIndex = activeIndex
    const containerEle = this.eles.list[containerEleIndex].containerEle
    const minSizeName = isHorizontal ? 'minWidth' : 'minHeight'
    const sizeName = isHorizontal ? 'width' : 'height'
    for (let index = activeIndex - 1; index >= 0; index--) {
      const ele = this.eles.list[index]
      const size = this.eleSizes[index][sizeName]
      if (size - rest < ele[minSizeName]!) {
        const maxDiff = size - ele[minSizeName]!
        rest = rest - maxDiff
        this.eleSizes[containerEleIndex][sizeName] += maxDiff
        this.eleSizes[index][sizeName] -= maxDiff
        containerEle.style[sizeName] = this.eleSizes[containerEleIndex][sizeName] + 'px'
        ele.containerEle.style[sizeName] = this.eleSizes[index][sizeName] + 'px'
      } else {
        this.eleSizes[containerEleIndex][sizeName] += diff
        this.eleSizes[index][sizeName] -= diff
        containerEle.style[sizeName] = this.eleSizes[containerEleIndex][sizeName] + 'px'
        ele.containerEle.style[sizeName] = this.eleSizes[index][sizeName] + 'px'
        break
      }
    }
  }
  destory() {
    this.mousedownElesListeners.forEach(d => d.ele.removeEventListener('mousedown', d.fn))
  }
} 
