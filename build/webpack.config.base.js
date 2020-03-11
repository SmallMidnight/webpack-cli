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
      // /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
      {
        test: /\.(png|jpg|gif|jpeg|webp)$/,
        use:{
          loader: 'url-loader', // 和file-loader功能相同，但更智能
          options: {
            // 配置打包后的文件名,具体可看webpack的file-loader文档
            // filename: '[name].ext?[hash]',
            name: '[name]_[hash:6].[ext]',
            //静态资源打包到指定的目录下
            outputPath: 'images/',
            // 将资源转换为 base64 可以减少网络请求次数，但是 base64 数据较大，如果太多的资源是 base64，会导致加载变慢，因此设置 limit 值时，需要二者兼顾。
            limit: 4096, // 当图片大小大于4k时将以文件形式输出，否则以base64输出
            // esModule 设置为 false，否则，<img src={require('XXX.jpg')} /> 会出现 <img src=[Module Object] />
            // esModule: false,
          }
        }
      },
      // 引入字体，svg等文件
      {
        test: /\.(svg|eot|ttf|woff|woff2)$/,
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