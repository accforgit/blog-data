import { CHANGE_LIST } from './constants'

const changeList = list => ({
  type: CHANGE_LIST,
  list
})

export const getHomeList = () => {
  // 这里路径要写全（包括域名），如果写成 /api/douban/movie 服务器端会认为请求域名是 127.0.0.1:80
  return (dispatch, getState, axiosInstance) => axiosInstance.get('/api/v2/movie/in_theaters').then(res => {
    console.log('请求 v2/movie/in_theaters接口：')
    if (res.data.code === 0) {
      dispatch(changeList(res.data.respData))
    }
  }).catch(e => {
    console.log('请求 v2/movie/in_theaters接口失败：', e)
  })
}