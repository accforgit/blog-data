// index/index.js
Page({
  goSolution(e) {
    wx.navigateTo({
      url: e.target.id === 'a' ? '/index/solutionA/index' : '/index/solutionB/index'
    })
  }
})