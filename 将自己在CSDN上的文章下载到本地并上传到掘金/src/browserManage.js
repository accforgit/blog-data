const puppeteer = require('puppeteer')
const { sleep } = require('./util.js')

/**
 * 用于管理 browser实例
 * 1. 生成browser实例，避免同一个功能启用多个browser实例
 * 2. 控制browser实例同时存在的 page个数，避免占用过多资源造成浏览器卡顿抛错
 * 3. 自动关闭无用的 browser实例
 */
class BrowserManage {
  constructor(maxPageCount = 5) {
    // maxPageCount 表示每个browser可以同时最多存在的 page数量
    this.maxPageCount = maxPageCount
    this.browser = null
    this.pageCount = 1
  }
  async newBrowser() {
    this.browser = await puppeteer.launch({
      slowMo: 10,
      headless: false
    })
    this.autoCloseBrowser()()
    return this
  }
  async newCtrlPage() {
    if (this.pageCount >= this.maxPageCount) {
      await sleep(100)
      return this.newCtrlPage()
    }
    this.pageCount++
    return await this.browser.newPage()
  }
  async closeCtrlPage(page) {
    this.pageCount--
    return await page.close()
  }
  // timer: 多长时间轮询查询一次 browser上挂载的实例，以确定是否关闭
  autoCloseBrowser(timer = 20000) {
    let browserUsed = true
    const that = this
    return async function polling() {
      const pCount = that.pageCount
      if (pCount <= 1) {
        if (!browserUsed) {
          // 已经 10s没有新开页面了，基本上说明不再使用了，关闭
          return await that.browser.close()
        } else {
          browserUsed = false
          await sleep(timer)
          return polling()
        }
      } else {
        // 当前 browser实例正在使用中正在使用中
        browserUsed = true
        await sleep(timer)
        return polling()
      }
    }
  }
}

const browserList = {}

// 生成 browser实例，避免生成太多browser实例
async function getBrowser(browserName, maxPageCount) {
  if (!browserList[browserName]) {
    browserList[browserName] = true
    const browser = new BrowserManage(maxPageCount)
    browserList[browserName] = await browser.newBrowser()
  } else if (browserList[browserName] === true) {
    // 正在创建 browser实例
    await sleep((Math.random() + 1) * 1000)
    return getBrowser(browserName)
  }
  return browserList[browserName]
}

module.exports = getBrowser