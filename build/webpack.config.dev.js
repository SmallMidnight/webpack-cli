const WebpackMerge = require('webpack-merge');
const base = require('./webpack.config.base');
const webpack = require('webpack');

module.exports = WebpackMerge({
  mode: 'development',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js'
    // publicPath: '/' //通常是CDN地址
  },
  module: {
    rules: [{
      test: /\.(css|less)$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
          }
        },
        'less-loader',
      ]

    }]
  },
  // 服务器配置
  devServer: {
    port: '8081', //默认是8080
    quiet: false, //默认不启用, 启用后 来自 webpack 的错误或警告在控制台不可见 
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    stats: "errors-only", //终端仅打印 error
    overlay: false, //默认不启用
    clientLogLevel: "silent", //日志等级
    compress: true, //是否启用 gzip 压缩
    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: true, // 解决单页面路由问题，
    contentBase: '../dist', //在配置了 html-webpack-plugin 的情况下， contentBase 不会起任何作用
    open: true, //自动打开浏览器
    hot: true, // 开启热替换, css代码更新不刷新页面
    // hotOnly: true 开启后只有手动配置才能更新，即使hot为true也不刷新浏览器
    proxy: {
      index: '', // 将index设置为空，可以对根路径进行转发
      'api/get': 'xxxx.com/api', // 第一种方式，直接代理到api路径
      'api/vue': { // 第二种方式，在路径需要临时替换时使用
        target: 'xxxx.com/api',
        pathRewrite: {
          'head': 'demo' //此时访问head路径将被代理到demo下
        },
        secure: false, //对https请求的配置，false为支持https
        changeOrigin: true //做代理分发时允许访问其他网站，突破网站限制，建议在开发环境使用
      },

    }
  },
  plugins: [
    // 我们配置了 HotModuleReplacementPlugin 之后，会发现，此时我们修改代码，仍然是整个页面都会刷新。不希望整个页面都刷新，还需要修改入口文件：
    new webpack.HotModuleReplacementPlugin()
  ],
  //devtool 中的一些设置，可以帮助我们将编译后的代码映射回原始源代码。不同的值会明显影响到构建和重新构建的速度。
  devtool: 'cheap-module-eval-source-map', 
}, base);