const path = require('path')

module.exports = {
  resolve: {
    alias: {
      '@root': path.resolve(__dirname),
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
            'react',
            'stage-0',
            ['env', {
              targets: {
                browsers: ['last 2 versions']
              }
            }]
          ],
          plugins: [
            'transform-runtime'
          ]
        }
      },
      {
        test: /\.css$/,
        use: ['isomorphic-style-loader', {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: true,
            localIdentName: '[name]_[local]_[hash:base64:5]'
          }
        }]
      },
    ]
  }
}