import React from 'react'
import './index.css'

// 标识预览的状态，1：显示，2：开始关闭，3：已关闭
let previewVisibleStatus = 3
// 当前预览的元素
let currentPreviewEle = null
// 记录动画起始状态的元素位置信息，left, top
const previewFirstRect = [0, 0]
const previewLastRect = [0, 0]
// 临时记录位置信息
let rectInfo = null
// First与Last两个状态之间的缩放比例
let scaleValue = 1
// 生成初始测试数据
let listData = Array(10).fill().map(() => {
  const width = getSize()
  const height = getSize()
  return {
    width,
    height,
    bgPic: `https://dummyimage.com/${width}x${height}/${color16()}`
  }
})

// 获取在 200-900之间的随机整数
function getSize () {
  return Math.round(Math.random() * 700 + 200)
}
// 生成随机 16进制颜色
function color16(){
  return ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6)
}

export default class Preview extends React.Component {
  previewRef = React.createRef()
  state = {
    previewStatus: 0,
    previewImgInfo: null
  }
  componentDidUpdate () {
    // card 预览
    this.updatePreviewStatus()
  }
  updatePreviewStatus () {
    if (this.state.previewStatus === 1) {
      // Last + Invert
      if (previewVisibleStatus === 1) {
        const lastRectInfo = this.previewRef.current.getBoundingClientRect()
        previewLastRect[0] = lastRectInfo.left
        previewLastRect[1] = lastRectInfo.top
        scaleValue = rectInfo.width / lastRectInfo.width
      }
      this.setState({
        previewStatus: 2
      })
    } else if (this.state.previewStatus === 2) {
      // Play
      setTimeout(() => {
        this.setState({
          previewStatus: 3
        })
      }, 0)
    }
  }
  previewItem (status, previewImgInfo = null, e) {
    previewVisibleStatus = status
    if (previewVisibleStatus === 1) {
      currentPreviewEle = e.target
      // First
      rectInfo = currentPreviewEle.getBoundingClientRect()
      previewFirstRect[0] = rectInfo.left
      previewFirstRect[1] = rectInfo.top
      this.setState({
        previewImgInfo,
        previewStatus: 1
      })
    } else {
      this.setState({
        previewStatus: 1
      })
    }
  }
  transEnd (e) {
    if (previewVisibleStatus === 2 && previewVisibleStatus !== 3) {
      previewVisibleStatus = 3
      this.setState({
        previewStatus: 0
      })
    }
  }
  render () {
    const { previewStatus, previewImgInfo } = this.state
    return (
      <>
        <ul className="pic-list">
          {
            listData.map((item, index) => (
              <li
                key={index}
                className="pic-item"
                onClick={this.previewItem.bind(this, 1, item)}
                title="点击预览">
                <img src={item.bgPic} alt="" className="pic" />
              </li>
            ))
          }
        </ul>
        {
          (previewVisibleStatus === 1 || previewVisibleStatus === 2) ? (
            <>
              <div className="preview-box"
                onClick={this.previewItem.bind(this, 2)}
                style={{
                  opacity: previewStatus === 3 && previewVisibleStatus !== 2 ? .65 : 0
                }}></div>
              <img
                ref={this.previewRef}
                className={`img${(previewStatus === 3 && previewVisibleStatus === 1) || previewVisibleStatus === 2 ? ' active' : ''}`}
                src={previewImgInfo.bgPic}
                style={{
                  transform: previewStatus === 2 || previewVisibleStatus === 2
                    ? `translate3d(${previewFirstRect[0] - previewLastRect[0]}px, ${previewFirstRect[1] - previewLastRect[1]}px, 0) scale(${scaleValue})`
                    : 'translate3d(0, 0, 0) scale(1)',
                  transformOrigin: '0 0'
                }}
                onClick={this.previewItem.bind(this, 2)}
                onTransitionEnd={this.transEnd.bind(this)}
                alt="" />
            </>
          ) : null
        }
      </>
    )
  }
}
