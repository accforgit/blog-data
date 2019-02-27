/**
 * 数据服务器
 */
const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const session = require('koa-session')
const axios = require('axios')

const app = new Koa()

app.keys = ['secret key']

const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  httpOnly: true,
  credentials: true,
  origin: '*'
}

app.use(session(CONFIG, app))

app.use(async ctx => {
  const reqPath = ctx.request.path
  console.log('dataServer收到请求：', reqPath, ctx.session.isLogin)
  if (reqPath.indexOf('/v2') !== -1) {
    // 请求豆瓣 api
    let result = null
    try {
      result = await axios.get('http://api.douban.com' + reqPath.replace(/^\/api/, ''))
    } catch(e) {
      console.log('dataServer Error1:', e.toString())
      return ctx.body = {
        code: -1,
        respData: e.toString()
      }
    }
    if (result.data.subjects) {
      // 豆瓣图片进行了防盗链，所以用服务器直接下载到本地
      const downLoadPending = result.data.subjects.map(async item => {
        await axios({
          url: item.images.small,
          responseType: 'arraybuffer'
        }).then(res => {
          const picName = item.images.small.replace(/.+\//, '')
          const localPath = path.resolve(__dirname, '../public', picName)
          item.images.small = '/' + picName
          if (!fs.existsSync(localPath)) {
            // 写入到本地
            fs.writeFileSync(localPath, res.data)
          }
        })
      })
      await Promise.all(downLoadPending)
    }
    ctx.body = {
      code: 0,
      respData: result.data
    }
  } else {
    ctx.body = responseCase(ctx, reqPath)
  }
})

function responseCase (ctx, reqPath) {
  switch (reqPath) {
    case '/api/isLogin':
      return Boolean(ctx.session.isLogin)
    case '/api/login':
      ctx.session.isLogin = true
      return true
    case '/api/logout':
      ctx.session.isLogin = false
      return false
    default:
      return 404
  }
}

app.listen(9000)
console.log('dataServer running at http://127.0.0.1:9000/')
