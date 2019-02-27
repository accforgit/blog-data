import Koa from 'koa'
import serve from 'koa-static'
// react-router官网示例使用的是 react-router-dom中的 matchPath，但此 API无法匹配多级路由，所以使用 matchRoutes
import { matchRoutes } from 'react-router-config'
// 代理服务器，代理请求
import httpProxy from 'http-proxy'

import { getStore } from '@/store'
import routes from '@/Routes'
import render from './render'

const app = new Koa()

const proxy = httpProxy.createProxyServer()

app.use(serve('public'))

// api接口请求
// SSR 将 node-server当做中间层，那么SSR的页面的客户端数据请求就不应该直接请求数据源，
// 而应该通过 node-server作为一个代理服务器进行间接获取数据，这样可以减小数据出错的几率
// 所以，这里让客户端的数据请求直接请求 node-server，然后再在node-server里进行一次代理请求
const proxyMiddleware = async (ctx, next) => {
  if (ctx.request.path.indexOf('/api') !== 0) return next()
  console.log('请求接口', ctx)
  // 转发接口请求到数据源服务器
  await new Promise((resolve, reject) => {
    proxy.web(ctx.req, ctx.res, { target: 'http://localhost:9000' }, e => {
      const status = {
        ECONNREFUSED: 503,
        ETIMEOUT: 504
      }[e.code]
      ctx.status = status || 500
      reject(e)
    })
  })
  next()
}
app.use(proxyMiddleware)

// 页面请求
app.use(async ctx => {
  console.log('请求页面:', ctx)
  const store = getStore(ctx.request)
  const promises = []
  // 匹配的路由
  const mtRoutes = matchRoutes(routes, ctx.request.path)
  mtRoutes.forEach(item => {
    if (item.route.loadData) {
      // 为了保证尽可能让能够成功的请求全部成功，不被失败的请求干扰，这里多包装一层 Promise
      promises.push(new Promise(resolve => {
        // 无论成功还是失败都返回 resolve，以便让后面的 Promise.all可以等待所有请求完成
        item.route.loadData(store).then(resolve).catch(resolve)
      }))
    }
  })
  // 这里服务器请求数据接口，获取当前页面所需的数据，填充到 store中用于渲染页面
  await Promise.all(promises)
  await render(ctx, store, routes)
})
app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/')
})
