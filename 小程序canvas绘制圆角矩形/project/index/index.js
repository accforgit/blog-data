Page({
  data: {
    canvasWidth: 200,
    canvasHeight: 200
  },
  onReady() {
    const ctx = wx.createCanvasContext('shareCard')
    this.createImgResource('https://dummyimage.com/200x200/58a').then(imgUrl => {
      ctx.save()
      this.roundRect(ctx, 40, 40, this.data.canvasWidth - 80, this.data.canvasHeight - 80, 10)
      ctx.drawImage(imgUrl, 40, 40, this.data.canvasWidth - 80, this.data.canvasHeight - 80)
      ctx.restore()
      ctx.font = '16px sans-serif'
      ctx.fillText('text2', 20, 20)
      ctx.fillText('text', 60, 60)
      ctx.draw()
    })
  },
  roundRect(ctx, x, y, w, h, r) {
    // 开始绘制
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    ctx.setFillStyle('transparent')
    // ctx.setStrokeStyle('transparent')
    // 绘制左上角圆弧
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    // 绘制border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 绘制右上角圆弧
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // 绘制border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 绘制右下角圆弧
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // 绘制border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 绘制左下角圆弧
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // 绘制border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)
    
    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip()
  },
  saveImageToPhotosAlbum() {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: this.data.canvasWidth,
      height: this.data.canvasHeight,
      canvasId: 'shareCard',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          complete(res) {
            if (res.errMsg.indexOf('ok') > -1) {
              // console.log('成功保存')
            } else if (res.errMsg.indexOf('fail')) {
              wx.openSetting()
            }
          }
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  createImgResource(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url,
        complete: res => {
          if (res.errMsg.indexOf('ok') > -1) {
            resolve(res.tempFilePath)
          } else {
            reject('下载图片失败，请稍后重试')
          }
        }
      })
    })
  }
})