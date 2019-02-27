import { CHANGE_LOGIN } from './constants'

const changeLogin = value => ({
  type: CHANGE_LOGIN,
  value
})

export const getHeaderInfo = () => {
  // 这里路径要写全（包括域名），如果写成 /api/douban/movie 服务器端会认为请求域名是 127.0.0.1:80
  return (dispatch, getState, axiosInstance) => axiosInstance('/api/isLogin').then(res => {
    console.log('请求 islogin接口', res.data)
    dispatch(changeLogin(res.data))
  }).catch(e => {
    console.log('请求 islogin接口失败：', e)
  })
}

export const login = () => {
  // 这里路径要写全（包括域名），如果写成 /api/douban/movie 服务器端会认为请求域名是 127.0.0.1:80
  return (dispatch, getState, axiosInstance) => axiosInstance('/api/login').then(res => {
    console.log('请求 login接口', res.data)
    dispatch(changeLogin(true))
  }).catch(e => {
    console.log('请求 login接口失败：', e)
  })
}

export const logout = () => {
  return (dispatch, getState, axiosInstance) => axiosInstance('/api/logout').then(res => {
    console.log('请求 logout接口', res.data)
    dispatch(changeLogin(false))
  }).catch(e => {
    console.log('请求 logout接口失败：', e)
  })
}
