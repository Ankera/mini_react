const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackBar = require('webpackbar')
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin')

/**
 * 汇总
 * https://juejin.cn/post/7111922283681153038#heading-11
 * 
 * hash，chuckHash，contentHash 区别
 * https://juejin.cn/post/6844903998944706574#heading-0
 */

const isDEV = process.env.NODE_ENV === 'development' // 是否是开发模式

module.exports = {
  entry: path.join(__dirname, '../src/index.tsx'),
  output: {
    // filename: 'static/js/[name].js',
    filename: 'static/js/[name].[chunkhash:8].js', // // 加上[chunkhash:8]
    path: path.join(__dirname, '../dist'),
    clean: true,
    publicPath: '/'
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src')
    },
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    // modules: [path.resolve(__dirname, '../node_modules')],
  },
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, '../src')], // 只对项目src文件的ts,tsx进行loader解析
        test: /.(ts|tsx)$/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
                   // 设置兼容目标浏览器版本,也可以在根目录配置.browserslistrc文件,babel-loader会自动寻找上面配置好的文件.browserslistrc
                   targets: { browsers: ["> 1%", "last 2 versions", "not ie <= 8"] },
                   useBuiltIns: "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
                   corejs: 3, // 配置使用core-js使用的版本
                   loose: true,
                  }
                ],
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              plugins: [
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                isDEV && require.resolve('react-refresh/babel'), // 如果是开发模式,就启动react热更新插件
              ].filter(Boolean) // 过滤空值
            },
          }
        ]
      },
      {
        include: [path.resolve(__dirname, '../src')],
        test: /\.css$/,
        use: [
          isDEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        include: [path.resolve(__dirname, '../src')],
        test: /\.less$/,
        use: [
          isDEV ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator: {
          // filename:'static/images/[hash][ext]', // 文件输出目录和命名
          filename: 'static/images/[name].[contenthash:8][ext]' // 加上[contenthash:8]
        }
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator: {
          // filename:'static/fonts/[name][ext]', // 文件输出目录和命名
          filename: 'static/fonts/[name].[contenthash:8][ext]' // 加上[contenthash:8]
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator: {
          // filename:'static/media/[name][ext]', // 文件输出目录和命名
          filename: 'static/media/[name].[contenthash:8][ext]' // 加上[contenthash:8]
        },
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      inject: true, // 自动注入静态资源
      minify: {
        collapseWhitespace: true, //去空格
        removeComments: true, // 去注释
      },
    }),


    new WebpackBar({
      color: "#85d",  // 默认green，进度条颜色支持HEX
      basic: true,   // 默认true，启用一个简单的日志报告器
      profile:false,  // 默认false，启用探查器。
    }),
    new ProgressBarWebpackPlugin(),
  ]
}