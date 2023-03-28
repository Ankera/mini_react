const path = require('path');
const DemoPlugin = require('./plugins/demo-plugin');

module.exports = {
  entry: './src/entry5.js',
  output: {
    path: path.resolve(__dirname, 'dist5'),
    filename: '[name].js',
  },
  recordsPath: path.join(__dirname, 'dist5/records.json'),
  mode: 'development',
  module: {
    rules: [
      {
        test: /.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new DemoPlugin({
      type: 'demo'
    })
  ]
}