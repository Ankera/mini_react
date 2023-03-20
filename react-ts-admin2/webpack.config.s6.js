const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RunPlugin = require('./webpack/plugins/run-plugin');
const DonePlugin = require('./webpack/plugins/done-plugin');

module.exports = {
  entry: "./src/entry6.js",
  mode: 'development',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'dist6'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  module: {
    rules: [
      /**
       * pictch1    pictch3   pictch2
       * 
       * log1       log3      log2
       */
      {
        test: /\.js$/,
        enforce: 'pre',
        use: [
          path.resolve(__dirname, 'webpack/loaders/logger1.js'),
          path.resolve(__dirname, 'webpack/loaders/logger3.js'),
          // path.resolve(__dirname, 'webpack/loaders/logger2.js'),
         
        ]
      },
      // {
      //   test: /\.js$/,
      //   use: [
      //     path.resolve(__dirname, 'webpack/loaders/logger1.js'),
      //     // path.resolve(__dirname, 'webpack/loaders/logger3.js'),
      //     path.resolve(__dirname, 'webpack/loaders/logger2.js'),
      //   ]
      // },
      // 1 2 1 3
      // 3 1 2 1
    ]
  },
  plugins: [
    new RunPlugin(),
    new DonePlugin(),
    new webpack.DefinePlugin({
      __WEBPACK__ENV: JSON.stringify("xyz")
    }),
    new HtmlWebpackPlugin({
      // inject: false,
      template: path.join(__dirname, 'src/index.html'),
    }),
  ]
}