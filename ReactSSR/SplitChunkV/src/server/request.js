import axios from 'axios'

export default req => axios.create({
  baseURL: 'http://localhost:9000',
  headers: {
    // 转发请求验证登录，需要把 cookie 带上
    cookie: req.header.cookie || ''
  }
})
