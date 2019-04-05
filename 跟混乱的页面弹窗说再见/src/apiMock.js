export default item => {
  return new Promise(resolve => {
    // 通过 setTimeout模拟接口的异步请求
    setTimeout(() => {
      resolve(item)
    }, Math.random() * 3000)
  })
}