
const { sleep, timeout } = require('./util')
const download = require('./download')
const getBrowser = require('./browserManage')

// 获取所有的详情页链接
async function getArticleIds(browserManage, url) {
  const evPage = await browserManage.newCtrlPage()
  await evPage.goto(url, { timeout })
  await evPage.waitForSelector('.article-item-box')
  // 获取当前翻页的所有详情页链接
  const pageDetailIds = await evPage.$$eval('.article-item-box h4 a', eles => eles.map(e => e.href.match(/\/(\d+)$/)[1]))
  await browserManage.closeCtrlPage(evPage)
  // 返回当前列表页包含的文章 Id
  return pageDetailIds
}

// 处理编辑页
async function manageEditPage(browserManage, articleId, editorPage) {
  if (!editorPage) {
    editorPage = await browserManage.newCtrlPage()
    await editorPage.goto(`https://mp.csdn.net/mdeditor/${articleId}`, { timeout })
    await editorPage.waitForSelector('.editor-content', { timeout })
    await sleep(800)
  }
  // 获取标题
  const title = await editorPage.$eval('#txtTitle', ele => ele.value)
  if (title.trim().indexOf('欢迎使用CSDN-markdown编辑器') !== -1 || !title) {
    // 说明页面还没初始化完成，需要继续等待
    await sleep(1000)
    return manageEditPage(browserManage, articleId, editorPage)
  }
  const editorContent = await editorPage.$eval('.editor-content', ele => ele.textContent)
  // 开始下载
  download(title, editorContent, articleId)
  await browserManage.closeCtrlPage(editorPage)
}

const getCSDNData = async () => {
  const browserManage = await getBrowser('getCSDNData')
  const page = await browserManage.newCtrlPage()
  await page.goto('https://passport.csdn.net/account/login', { timeout })
  await page.click('.login-code__open')
  await sleep(1000)
  await page.waitForSelector('#username')
  // 输入你的账户名
  await page.type('#username', 'Your account')
  // 输入你的密码
  await page.type('#password', 'Your password')
  // 登录
  const loginBtn = await page.$('.logging')
  await loginBtn.click()
  await page.waitForNavigation()
  console.log('csdn登录成功')
  // 前往文章列表页 第 1 页，从第1页获取所有的翻页信息
  await page.goto('https://blog.csdn.net/DeepLies/article/list/1', { timeout })
  // 获取所有翻页页面
  await page.waitForSelector('#pageBox li')
  // 获取所有页码 li内的文本，作用是根据这些文本中的数字找到最大页码
  const pageNumLiText = await page.$$eval('#pageBox li', eles => Array.from(eles).map(ele=>ele.textContent))
  // 最大页码，也就等于翻页的总页面数
  const maxPageNum = Math.max.apply(Math, pageNumLiText.reduce((total, d) => {
    if (!isNaN(Number(d))) return total.concat(+d)
    return total
  }, []))
  await browserManage.closeCtrlPage(page)
  console.log(`共 ${maxPageNum}页列表翻页`)

  // 翻页的共同url字符串
  const baseUrl = 'https://blog.csdn.net/DeepLies/article/list/'
  // 暂存翻页链接
  let listPage = []
  for (let i = 1; i < maxPageNum + 1; i++) {
    listPage.push(baseUrl + i)
  }

  Promise.all(listPage.map(url => getArticleIds(browserManage, url))).then(data => {
    // 已经获取到所有文章的 id 了
    const articleIds = data.reduce((total, current) => total.concat(current), [])
    articleIds.forEach(async (articleId, i) => {
      await sleep(i * 500)
      manageEditPage(browserManage, articleId)
    })
  }).catch(err => {
    console.log('Promise.all Error:', err)
  })
}

module.exports = getCSDNData
