const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ArchivePlugin = require('./plugins/archive-plugin.js')

module.exports = {
  entry: './src/entry6.js',
  mode: 'development',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'dist6'),
    filename: '[name].js',
  },
  context: process.cwd().replace(/\\/g, '/'),
  // resolveLoader: {
  //   modules: ['node_modules', path.resolve(__dirname, 'loaders')]
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [],
          },
        },
      },
      {
        test: /\.(css|less)$/,
        use: [
          // 'style-loader',
          // 'css-loader',
          // 'less-loader'
          path.join(__dirname, 'loaders', 'style-loader.js'),
          path.join(__dirname, 'loaders', 'less-loader.js'),
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index6.html'),
    }),
    new ArchivePlugin(),
  ],
}
