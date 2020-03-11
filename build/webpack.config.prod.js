const WebpackMerge = require('webpack-merge');
const base = require('./webpack.config.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = WebpackMerge({
  mode: 'production',
  output: {
    filename: 'js/[name]_[contenthash].js', //入口文件名称
    chunkFilename: 'js/[name]_[contenthash].chunk.js' //非入口文件名称
  },
  module: {
    rules: [{
      test: /\.(css|less)$/,
      use: [ // loader解析的顺序是从下到上，从右到左的顺序
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            filename: '[name].css',
            chunkFilename: '[name].css',
            publicPath: '../', //****最后打包的时候替换引入文件路径
          }
        },
        // 'style-loader',  使用MiniCssExtractPlugin时就不能使用style-loader了
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2 //该方式可以让@import引入的css文件再次执行一遍css打包loader
          }
        },
        'less-loader'
      ]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name]_[hash].css',
      chunkFilename: 'css/[name]_[hash].chunk.css'
    }),
    new CleanWebpackPlugin(), //默认是清除dist目录
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      // chunks: 'async', // async表示只对异步代码进行分割
      minSize: 30000, // 当超过指定大小时做代码分割
      // maxSize: 200000,  // 当大于最大尺寸时对代码进行二次分割
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '_',
      name: true,
      cacheGroups: { // 缓存组：如果满足vendor的条件，就按vender打包，否则按default打包
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 权重越大，打包优先级越高
          // filename: 'js/vender.js'  //将代码打包成名为vender.js的文件
          name: 'vender'
        },
        default: {
          minChunks: 2,
          priority: -20,
          name: 'common',
          // filename: 'js/common.js',
          reuseExistingChunk: true // 是否复用已经打包过的代码
        }
      }
    },
    usedExports: true
  }
}, base);