const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: path.resolve(__dirname, 'index.js'),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js'
    },
    resolve: {
      enforceExtension: false,
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['es2015', 'react', 'stage-0']
              }
            }
          ]
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },

    plugins: [
      // html 模板插件
      new HtmlWebpackPlugin({
          template: __dirname + '/index.html'
      }),
      // 热加载插件
      new webpack.HotModuleReplacementPlugin(),
    ],

    devServer: {
      host: '0.0.0.0',
      port: 8086,
      historyApiFallback: true, //不跳转
      inline: true, //实时刷新
      hot: true  // 使用热加载插件 HotModuleReplacementPlugin
    }
}