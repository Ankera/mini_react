const path = require('path');
const { ProgressPlugin } = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack')


const isProd = process.env.NODE_ENV === 'prod';

/**
 * https://juejin.cn/post/7058173550879834125#heading-4
 */

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src', 'index'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].[hash].js",
  },
  devServer: {
    static: path.resolve(__dirname, '../dist'),
    compress: true,
    hot: true,
    port: 8080,
    // 代理方法1
    proxy: {
      '/api': 'http://localhost:3000'
    },
    // 代理方法2
    onBeforeSetupMiddleware({app}){
      app.get('/api/user2', (req, res) => {
        res.send({
          code: 10000,
          data: {
            name: "Tom1111",
            age: 12
          }
        })
      });
    }
  },
  devtool: isProd ? "nosources-source-map" : "eval-cheap-module-source-map",
  mode: 'development',
  externals: {
    // key 值库的名字，value 是全局变量名
    lodash: "_"
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          isProd ?  MiniCssExtractPlugin.loader : 'style-loader',  
          { 
            loader: "css-loader", 
            /** 
             * 开启css module 
             * css文件处理之前先加载上一个loader 即postcss-loader 来处理兼容问题 
             */
            options: { 
              // import: true,
              importLoaders: 1, // 允许或者启动几个数量的 loader 在 @important 语法中 
              modules: true,
              // esModule: true,
            }
          }, 
          { 
            loader: 'postcss-loader',
            options: { 
              postcssOptions: { 
                // 自动添加不同浏览器浅醉 并处理新特性  
                plugins: ['postcss-preset-env'] 
              } 
            }
          },
          'less-loader',
        ]
      },
      {
        test: /\.(png|jpg|svg)$/,
        type: 'asset/resource'
      },
      {
        test: /isarray/,
        use: [
          {
            loader: 'expose-loader',
            options: {
              exposes: {
                globalName: 'isarray',
                override: true
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ProgressPlugin(),

    new ProgressBarWebpackPlugin(),

    new CleanWebpackPlugin(),

    // 抽离css插件
    new MiniCssExtractPlugin({
      // filename: 'static/css/[hash].css' // 抽离css的输出目录和名称
      filename: 'static/css/[name].[contenthash:8].css' // 加上[contenthash:8]
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
    }),

    new webpack.DefinePlugin({
      'xxxx': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.ProvidePlugin({
      isarray: "isarray"
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    })
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
    ],
    // minimize: true, 
    minimizer: [new TerserPlugin()]
  } 
}

console.log('=======', path.resolve(__dirname, 'public'))