const path = require('path')
const { sleep } = require('./util')
const getBrowser = require('./browserManage')
let browserManage = null

// 因为csdn图片使用武力防盗链技术，无法直接抓取图片，所以这里直接使用截图方式保存图片
const screenShot = async(pageHandle, rects, title, content, picFlag = 0) => {
  let clip = null
  if (clip = rects.pop()) {
    const fileName = `${Date.now()}.png`
    // 置换原本的图片链接
    let i = 0
    content = content.replace(/!\[.*?\]\(.+?\)/g, m => {
      if (i++ === picFlag) {
        return m.replace(/\(.+?\)/, `(${fileName})`).replace(/\[.*?\]/, '[img]')
      }
      return m
    })
    // 对图片进行截图操作
    await pageHandle.screenshot({ path: path.resolve(__dirname, `../article/${title}/${fileName}`), clip })
    return screenShot(pageHandle, rects, title, content, picFlag + 1)
  }
  // 页面上图片全部下载完毕
  await browserManage.closeCtrlPage(pageHandle)
  return content
}

const downloadImg = async ({title, content, articleId}) => {
  browserManage = await getBrowser('downloadImg')
  const page = await browserManage.newCtrlPage()
  await page.goto(`https://blog.csdn.net/DeepLies/article/details/${articleId}`, { timeout: 0 })
  const imgsReactList = await page.evaluate(async () => {
    // 外部的 sleep函数传不进来，只能重新定义
    function sleep(timer = 1) {
      return new Promise(resolve => {
        const st = setTimeout(() => {
          clearTimeout(st)
          resolve()
        }, timer * 1000)
      })
    }
    async function imgReload (img) {
      return new Promise(resolve => {
        img.onload = () => resolve()
      })
    }
    // 隐藏广告元素
    const adEle = document.querySelector('.pulllog-box')
    adEle && (adEle.style.display = 'none')
    // 点开 阅读更多 按钮，让页面内容完全呈现出来
    const btnMore = document.getElementById('btn-readmore')
    btnMore && document.getElementById('btn-readmore').click()
    // 获取页面上所有图片
    let imgs = Array.from(document.querySelectorAll('.markdown_views img') || [])
    if (!imgs.length) return []
    // 去掉图片链接中的加水印参数
    imgs.forEach(img => {
      const mt = img.src.match(/(.+)\?/)
      mt && (img.src = mt[1])
    })
    // 如果图片超过5张，则认为平均每张图片需要2s加载完毕，小于等于5张则假设全部加载完毕最多需要10s
    // 超时则认为网络有问题，就不管了
    await Promise.race([sleep(imgs.length > 5 ? imgs.length * 2 : 10), Promise.all(imgs.map(img => imgReload(img)))])
    const rects = imgs.map(img => {
      const { left, top, width, height } = img.getBoundingClientRect()
      return { x: left, y: top, width, height }
    })
    // 隐藏掉滚动条，防止因为图片一部分在视窗内一部分在视窗外，导致截屏中出现滚动条
    document.body.style.overflow = 'hidden'
    return rects
  })
  return screenShot(page, imgsReactList, title, content, 0)
}

module.exports = downloadImg

