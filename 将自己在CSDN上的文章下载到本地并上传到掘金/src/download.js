const path = require('path')
const fs = require('fs')
const upload = require('./upload')
const downloadImg = require('./downloadImg')
const { clearFilePath } = require('./util')
const successDownLoad = [], errorDownload = []

// 将下载下来的文章保存到本地文件
const download = async(title, content, articleId) => {
  // 写文件前，先把图片下载下来，并替换文件名
  // 因为标题被处理过了，可能不是原来的标题，所以这里将原来完整的标题也加到正文里去
  const realTitle = clearFilePath(title)
  fs.mkdirSync(path.resolve(__dirname, '../article', realTitle))
  const manageContent = await downloadImg({title: realTitle, content, articleId})
  console.log('开始下载：', title)
  const realContent = `# ${title}\n\n` + manageContent
  fs.writeFile(path.resolve(__dirname, '../article', realTitle, 'index.md'), realContent, err => {
    if (err) {
      console.log('createFile Err:', title, err)
      errorDownload.push(title)
      console.log(`下载失败的文章(共${errorDownload.length}篇)：`, errorDownload)
    } else {
      // 如果你不想上传，就不调用 upload 即可
      upload(title, manageContent)
      successDownLoad.push(title)
      console.log(`已经下载完毕${successDownLoad.length}篇文章`)
    }
  })
}

module.exports = download