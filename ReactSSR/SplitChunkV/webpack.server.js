const path = require('path')
const nodeExternals = require('webpack-node-externals')
const merge = require('webpack-merge')
const config = require('./webpack.base.js')

module.exports = merge(config, {
  // 告诉 webpack打包的是 node端代码，避免把nodejs内置的模块打包到输出文件中，例如 fs path
  target: 'node',
  // 避免把 node_modules包下的第三方模块中包含的 nodejs内置的模块打包到出书文件中
  externals: [nodeExternals()],
  // 入口文件
  entry: './src/server/index.js',
  // 表示是开发环境还是生产环境的代码
  mode: 'development',
  // 输出信息
  output: {
    // 输出文件名
    filename: 'bundle.js',
    // 输出文件路径
    path: path.resolve(__dirname, 'build')
  },
  // 避免路径丢失
  node: {
    __filename: true,
    __dirname: true	
  }
})
