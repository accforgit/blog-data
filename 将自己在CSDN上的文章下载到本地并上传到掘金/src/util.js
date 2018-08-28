const puppeteer = require('puppeteer')

// 导航超时时间
const timeout = 300000
// 系统
const browserFetcher = puppeteer.createBrowserFetcher()
const platform = browserFetcher.platform()

/**
 * 有的标题中含有特殊字符，例如 / :等，无法作为文件名，所以需要清理一下
 * @param {*} filePath: 需要被清理的源文件名
 */
const clearFilePath = filePath => {
  return filePath.replace(/[\/:*?"<>|]/g, '!')
}

const sleep = (timer = 500) => {
  return new Promise(resolve => {
    const st = setTimeout(() => {
      clearTimeout(st)
      resolve()
    }, timer)
  })
}

module.exports = {
  timeout,
  platform,
  sleep,
  clearFilePath
}