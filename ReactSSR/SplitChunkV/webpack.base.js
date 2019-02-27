const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')

module.exports = {
  plugins: [
    new LoadablePlugin(),
    new MiniCssExtractPlugin({
      filename: `styles/[name].css`
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          // 需要支持 react
          // 需要兼容 stage-0
          presets: [
            '@babel/preset-react',
            // 'stage-0',
            ['@babel/preset-env', {
              targets: {
                browsers: ['last 2 versions']
              }
            }]
          ],
          plugins: [
            '@babel/plugin-transform-runtime',
            '@loadable/babel-plugin'
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: path.resolve(__dirname, 'public')
            }
          },
          "css-loader"
        ]
      }
    ]
  }
}