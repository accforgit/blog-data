const path = require('path')
const { sleep, timeout, platform } = require('./util')
const getBrowser = require('./browserManage')

// 登录状态flag
// 0: 没有 browser实例; 1: 正在创建 browser实例以及正在尝试登录; 2: 已经存在 browser实例并且已经是登录状态
let loginStatus = 0
let browserManage = null

async function manageContent4UploadImg(page, articleTitle, content) {
  // 这种方法，最后得到的contentArr的长度肯定比 imgArr多 1
  const contentArr = content.split(/!\[.*?\]\(.*?\)/)
  const imgArr = []
  content.replace(/!\[.*?\]\((.+?)\)/g, (m1, m2) => imgArr.push(m2))
  // 上传本地图片
  await uploadPic(page, articleTitle, imgArr)

  const imgJuejinUrl = await page.$eval('.ace_text-layer', ele => ele.textContent)
  const imgJuejinUrlArr = imgJuejinUrl ? imgJuejinUrl.match(/!\[\]\(.*?\)/g) : []
  // 拼接正文与图片链接
  const juejinContent = contentArr.reduce((t, c, i) => {
    return t.concat(c, imgJuejinUrlArr[i] || '')
  }, []).join('')

  // 清空编辑框中的图片链接文本
  // Mac不支持 Ctrl + A全选，所以需要兼容写法
  if (platform.indexOf('win') !== -1) {
    // window系统
    await page.keyboard.down('ControlLeft')
    await page.keyboard.down('A')
    await page.keyboard.up('A')
    await page.keyboard.up('ControlLeft')
    await page.keyboard.press('Backspace')
  } else {
    // 认为是 mac
    // +10 是为了保证完全清空
    for (let i = 0; i < imgJuejinUrl.length + 10; i++) {
      await page.keyboard.down('Backspace')
    }
    await page.keyboard.up('Backspace')
  }
  // 编辑框中输入正文
  await page.keyboard.sendCharacter(juejinContent)
}

// 上传本地图片
async function uploadPic(page, articleTitle, imgArr) {
  const fileBaseName = imgArr.pop()
  if (fileBaseName) {
    const relativePath = path.resolve(__dirname, `../article/${articleTitle}/${fileBaseName}`)
    const uploadInput = await page.$('.image-file-selector', { hidden: true })
    // 遮罩层出现，说明开始上传
    await uploadInput.uploadFile(relativePath)
    await page.waitForSelector('.image-upload-progress-panel')
    // 上传的遮罩层又消失，则认为上传完成
    await page.waitForSelector('.image-upload-progress-panel', { hidden: true })
    await sleep(100)
    return uploadPic(page, articleTitle, imgArr)
  }
}

const upload = async (articleTitle, articleContent) => {
  if (loginStatus === 0) {
    loginStatus = 1
    // 没有登录
    // 打开登录页面
    browserManage = await getBrowser('upload')
    const page = await browserManage.newCtrlPage()
    await page.goto('https://juejin.im/', { timeout })
    await page.click('.login')
    await page.waitForSelector('.auth-form')
    await sleep()
    // 输入你的账户名
    await page.type('input[name=loginPhoneOrEmail]', 'Your account')
    // 输入你的密码
    await page.type('input[name=loginPassword]', 'Your password')
    // 登录
    const loginBtn = await page.$('.auth-form .btn')
    await loginBtn.click()
    await page.waitForNavigation()
    console.log('掘金登录成功')
    loginStatus = 2
    await browserManage.closeCtrlPage(page)
  } else if (loginStatus === 1) {
    // 正在尝试登录中
    await sleep(4000)
    return await upload(articleTitle, articleContent)
  }

  console.log(`准备上传 ${articleTitle}`)
  const publishPage = await browserManage.newCtrlPage()
  // 前往文章
  await publishPage.goto('https://juejin.im/editor/drafts/new', { timeout })
  await publishPage.waitForSelector('.title-input')
  const title = await publishPage.$eval('.title-input', ele => ele.value)
  if (title.trim()) {
    // 默认的介绍页面
    await publishPage.goto('https://juejin.im/editor/drafts/new', { timeout })
  }
  await publishPage.waitForSelector('.title-input')
  await publishPage.type('.title-input', articleTitle)
  await publishPage.click('.ace_content')
  // 如果有图片，则需要上传图片，得到所有的juejin图片链接，并且整理好输入的内容
  await manageContent4UploadImg(publishPage, articleTitle, articleContent)

  // 开始发布动作
  await publishPage.waitForSelector('.toggle-btn')
  await publishPage.$$eval('.toggle-btn', ele => ele[2].click())
  await sleep()
  await publishPage.waitForSelector('.category-list .item')
  await publishPage.$$eval('.category-list .item', ele => ele[1].click())
  await sleep()
  await publishPage.waitForSelector('.publish-btn')
  await publishPage.click('.publish-btn')
  await sleep()
  await publishPage.waitForNavigation()
  await sleep(1000)
  console.log(articleTitle + ' 发布成功')
  await browserManage.closeCtrlPage(publishPage)
}

module.exports = upload