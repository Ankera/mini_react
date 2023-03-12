const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist3'),
    filename: '[name].js'
  },
  mode: 'development',
  devtool: false,
module: {
  rules: [
    // {
    //   test: /\.js$/,
    //   exclude: /node_modules/,
    //   use: {
    //     loader: 'babel-loader',
    //     options: {
    //       plugins: [["import",
    //         {
    //           libraryName: "lodash",
    //           libraryDirectory: "",
    //         }
    //       ]]
    //     }
    //   }
    // },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          plugins: [
            [path.resolve(__dirname, 'import.js'),
              {
                libraryName: "lodash",
                libraryDirectory: "",
              }
            ],
            [
              path.resolve(__dirname, 'log.js')
            ]
          ]
        }
      }
    }
  ]
},
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
    }),
  ]
}