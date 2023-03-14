const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DonePlugin = require('./plugins/done-plugin');
const AutoExternalPlugin = require('./plugins/auto-external-plugin');

module.exports = {
  entry: './src/entry1.js',
  mode: 'development',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'dist4'),
    filename: '[name].js',
    // library: 'calculator',
    libraryTarget: 'commonjs2'
  },
  // externals: {
  //   'lodash': '_'
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
    }),

    new DonePlugin(),

    // new AutoExternalPlugin({
    //   lodash: {
    //     globalVariable: "_",
    //     url: "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.js"
    //   }
    // })
  ]
}