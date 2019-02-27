const path = require('path')
const merge = require('webpack-merge')
const config = require('./webpack.base.js')

module.exports = merge(config, {
  // 入口文件
  entry: './src/client/index.js',
  // 表示是开发环境还是生产环境的代码
  mode: 'development',
  // 输出信息
  output: {
    // 输出文件名
    filename: 'index.js',
    // 输出文件路径
    path: path.resolve(__dirname, 'public')
  }
})
