const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/entry1.js',
  mode: 'development',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'dist3'),
    filename: '[name].js'
  },
  resolveLoader: {
    // 配置别名
    alias: {
      'inline1-loader': path.resolve(__dirname, 'loaders/inline1-loader.js'),
      'inline2-loader': path.resolve(__dirname, 'loaders/inline2-loader.js'),
      'style-loader': path.resolve(__dirname, 'loaders/style-loader.js')
    },
    // 配置，去哪些目录下面找loader
    modules: ['node_modules', path.resolve(__dirname, 'loaders')]
  },
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: [
      //     path.resolve(__dirname, 'loaders/style-loader.js')
      //   ]
      // },
      {
        test: /\.js$/,
        // enforce: 'normal', // 默认
        use: [
          path.resolve(__dirname, 'loaders/normal1-loader.js'),
          path.resolve(__dirname, 'loaders/normal2-loader.js')
        ]
      },
      {
        test: /\.js$/,
        enforce: 'post',
        use: [
          path.resolve(__dirname, 'loaders/post1-loader.js'),
          path.resolve(__dirname, 'loaders/post2-loader.js')
        ]
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: [
          path.resolve(__dirname, 'loaders/pre1-loader.js'),
          // path.resolve(__dirname, 'loaders/pre2-loader.js')
          {
            loader: path.resolve(__dirname, 'loaders/pre2-loader.js'),
            options: {
              a: 1,
              b: 2,
              plugins: [
                '11111',
                '22222'
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
    }),
  ]
}