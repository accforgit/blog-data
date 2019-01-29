import React from 'react'
import './index.css'

let transArr = null
let activeIndex = 100000
let activeList = null
let rectInfo = null
// 0标识增加，1标识删除
let updateStatus = 0
// 用于调整 card层级，让排列层级变化的 card在动画过程中不被其他 card遮盖
let zIndex = 1
let cardIndex = 2
// 生成初始测试数据
let listData = Array(cardIndex).fill().map((item, index) => ({
  index
}))
// 生成一个二维数组
function getArrByLen(len) {
  return Array(len).fill().map(() => [0, 0])
}

export default class Card extends React.Component {
  listRef = React.createRef()
  state = {
    // 用于标记动画的状态
    animateStatus: 0,
    listData,
    inputValue: 0
  }
  componentDidUpdate () {
    // card 更新
    this.updateAnimateStatus()
  }
  updateAnimateStatus () {
    if (this.state.animateStatus === 1) {
      // Last + Invert
      const stepIndex = updateStatus === 0 ? 1 : 0
      activeList.forEach((itemEle, index) => {
        rectInfo = itemEle.getBoundingClientRect()
        transArr[index + stepIndex][0] = transArr[index + stepIndex][0] - rectInfo.left
        transArr[index + stepIndex][1] = transArr[index + stepIndex][1] - rectInfo.top
        // 横排的层级变化，则进行 z-index的提升以获得更好的视觉体验
        if (transArr[index + stepIndex][1] !== 0) {
          this.state.listData.some((v, k) => {
            if (index + stepIndex + activeIndex === k) {
              v.zIndex = zIndex++
              return true
            }
            return false
          })
        }
      })
      this.setState({
        animateStatus: 2
      })
    } else if (this.state.animateStatus === 2) {
      // Play
      // 重置
      transArr = getArrByLen(this.state.listData.length)
      setTimeout(() => {
        this.setState({
          animateStatus: 3
        })
      }, 0)
    }
  }
  updateItem (type, currentIndex) {
    updateStatus = type
    activeIndex = currentIndex
    // 位置需要进行改变的节点（可以大致认为位于当前变化节点之前的所有节点，位置完全不变）
    // 如果是删除操作，则 slice的起始坐标需要往后移一位
    activeList = Array.prototype.slice.call(this.listRef.current.children).slice(activeIndex + (updateStatus === 0 ? 0 : 1))
    // 如果是增加操作，则 transArr2的长度应该比 activeList 多 1
    const stepIndex = updateStatus === 0 ? 1 : 0
    transArr = getArrByLen(activeList.length + stepIndex)
    // First
    activeList.forEach((itemEle, index) => {
      rectInfo = itemEle.getBoundingClientRect()
      transArr[index + stepIndex][0] = rectInfo.left
      transArr[index + stepIndex][1] = rectInfo.top
    })
    let newListData = null
    if (updateStatus === 0) {
      newListData = this.state.listData.slice(0, activeIndex).concat({
        index: cardIndex++
      }, this.state.listData.slice(activeIndex))
    } else {
      newListData = this.state.listData.filter((value, index) => index !== activeIndex)
    }
    this.setState({
      animateStatus: 1,
      listData: newListData
    })
  }
  inputIndex (e) {
    let inputValue = +e.target.value
    if (inputValue > this.state.listData.length) {
      console.log('新增item的 index不能超过 listData的长度')
      inputValue = this.state.listData.length
    }
    this.setState({
      inputValue,
      animateStatus: 0
    })
  }
  render () {
    const { animateStatus, inputValue } = this.state
    return (
      <>
        <ul className="card-list" ref={this.listRef}>
          {
            this.state.listData.map((item, index) => (
              <li
                key={item.index}
                className={`card-item${index >= activeIndex && animateStatus === 3 ? ' active' : ''}`}
                style={
                  Object.assign({ zIndex: item.zIndex || 'auto' }, index >= activeIndex && animateStatus > 1
                    ? {transform: `translate(${transArr[index - activeIndex][0]}px, ${transArr[index - activeIndex][1]}px)`}
                    : null)
                }>
                  <div className="card-title">
                    <h3>Title - {item.index}</h3>
                    <span onClick={this.updateItem.bind(this, 1, index)} className="icon-btn" title="点击删除">Delete</span>
                  </div>
                  <div className="card-content">
                    <p className="content">content - {item.index}</p>
                    <p className="content">content - {item.index}</p>
                    <p className="content">content - {item.index}</p>
                  </div>
                </li>
            ))
          }
        </ul>
        <hr/>
        <div className="update-count">
          <input onChange={this.inputIndex.bind(this)} value={inputValue} type="number" />
          <button onClick={this.updateItem.bind(this, 0, inputValue)}>增加</button>
        </div>
      </>
    )
  }
}
