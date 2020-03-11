const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const template = path.resolve(__dirname, '../public/index.html')


module.exports = {
  entry: './src/index.js',        //这块为什么不是../src  ?
  output: {
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules:[
      {
        test: /\.jsx?$/,
        exclude:/node_modules/,
        include: path.resolve(__dirname, '../src'),
        use:['babel-loader'],
      },
      {
        test: /\.(jpg|pgn|gif)$/,
        use:{
          loader: 'url-loader', // 和file-loader功能相同，但更智能
          options: {
            // 配置打包后的文件名,具体可看webpack的file-loader文档
            filename: '[name].ext?[hash]',
            outputPath: 'images/',
            limit: 4096 // 当图片大小大于4k时将以文件形式输出，否则以base64输出
          }
        }
      },
      // 引入字体，svg等文件
      {
        test: /\.(eot|ttf|svg)$/,
        use:{
          loader: 'file-loader'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template,
      filename: 'index.html',
    })
  ],
  optimization: {
    usedExports: true
  },

}