const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

// https://blog.csdn.net/qq_49712611/article/details/125959856

module.exports = {
  entry: './src/index.tsx',
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    open: true,
    port: 8080,
    historyApiFallback: true
  },
  resolve: {
    extensions: ["", ".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@": require("path").resolve(__dirname, "./src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: 'ts-loader',
        exclude: "/node-modules/",
      },
      {
        enforce: 'pre',
        test: /\.(ts|tsx)?$/,
        use: 'source-map-loader'
      },
      {
        test: /\.less?$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new FriendlyErrorsWebpackPlugin(),
  ]
}