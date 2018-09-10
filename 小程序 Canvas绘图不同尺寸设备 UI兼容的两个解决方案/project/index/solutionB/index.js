const app = getApp()

// 以iphone6 作为基准
const baseWidth = 375
const baseHeight = 603

Page({
  data: {
    // 以iphone6 作为基准
    canvasWidth: 375,
    canvasHeight: 603,
    // 最终被用户看到的图片的尺寸
    picWidth: 0,
    picHeight: 0,
    // canvas保存到本地的图片路径
    picLocalPath: ''
  },
  onLoad() {
    wx.showLoading({ title: '正在绘制...' })
    this.getCurrentSize()
  },
  drawCanvas() {
    const ctx = wx.createCanvasContext('shareCard')
    ctx.rect(0, 0, this.data.canvasWidth, this.data.canvasHeight)
    ctx.setFillStyle('pink')
    ctx.fill()
    ctx.drawImage('../58a.png', 85, 100, 205, 250)
    ctx.setFontSize(16)
    ctx.setFillStyle('yellowgreen')
    ctx.fillText('flexible canvas', 100, 130)
    ctx.draw(false, () => {
      this.saveImageToLocal()
    })
  },
  // 获取当前设备尺寸信息
  getCurrentSize() {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      picWidth: systemInfo.windowWidth,
      picHeight: systemInfo.windowWidth * (baseHeight / baseWidth) 
    }, () => {
      // 等到 cover-view组件得到尺寸了，才能覆盖掉 canvas
      this.drawCanvas()
    })
  },
  saveImageToLocal() {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: this.data.canvasWidth,
      height: this.data.canvasHeight,
      canvasId: 'shareCard',
      success: res => {
        this.setData({
          picLocalPath: res.tempFilePath,
          // 避免在尺寸小的设备上溢出
          canvasWidth: 0,
          canvasHeight: 0
        }, () => {
          wx.hideLoading()
        })
      }
    })
  }
})
