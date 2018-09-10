const app = getApp()

// 以iphone6 作为基准
const baseWidth = 375
const baseHeight= 603
// 当前设备与iphone6的宽度比例
let scale = 1

Page({
  data: {
    canvasWidth: 0,
    canvasHeight: 0
  },
  onLoad () {
    this.getCurrentSize()
  },
  drawCanvas () {
    const ctx = wx.createCanvasContext('shareCard')
    ctx.drawImage('../58a.png', this.remSize(85), this.remSize(100), this.remSize(205), this.remSize(250))
    ctx.setFontSize(this.remSize(16))
    ctx.setFillStyle('yellowgreen')
    ctx.fillText('flexible canvas', this.remSize(100), this.remSize(130))
    ctx.draw()
  },
  // 获取当前设备尺寸信息
  getCurrentSize () {
    const { windowWidth, windowHeight } = wx.getSystemInfoSync()
    scale = windowWidth / baseWidth
    this.setData({
      canvasWidth: windowWidth,
      canvasHeight: windowWidth * (baseHeight / baseWidth)
    }, () => {
      this.drawCanvas()
    })
  },
  remSize (num) {
    return num * scale
  }
})
