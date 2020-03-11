# webpack-cli
单页/多页脚手架


支持ES6+JQuery+Less/Scss的单页/多页脚手架

支持ES6+React+Less/Scss+Typescript的单页/多页脚手架

支持ES6+Vue+Less/Scss+Typescript的单页/多页脚手架


# webpack配置过程记录

### 1. 初始化： init,webpack、webpack-cli（webpack4.+开箱即用）
### 2. JS转换为低版本：babel-loader,, 
### 3. 安装babel 依赖 
  npm install @babel/core @babel/preset-env @babel/plugin-transform-runtime @babel/preset-react -D
  npm install @babel/runtime @babel/runtime-corejs3

  @babel/plugin-transform-runtime 是一个可以重复使用 Babel 注入的帮助程序,以节省代码大小的插件。
  如果我们希望 @babel/plugin-transform-runtime 不仅仅处理帮助函数,同时也能加载 polyfill 的话,我们需要给 @babel/plugin-transform-runtime 增加配置信息。首先新增依赖 @babel/runtime-corejs3,修改配置文件如下(移除了 @babel/preset-env 的 useBuiltIns 的配置
### 4. 自动将打包好的文件引入到html页面,html-webpack-plugin
### 5. 配置devServer,实时在浏览器展示,配置proxy,解决跨域调用接口问题,可以调整控制台的log输出
### 6. 配置devtool,将编译的代码映射回源码,方便调试
### 7. 处理样式文件,style-loader、css-loader、postcss-loader(解决兼容性)、less-loader、sass-loader、postcss-loader autoprefixer 
    loader的执行顺序：从右到左(从下到上)
    npm install style-loader less-loader css-loader postcss-loader autoprefixer less -D
    pstyle-loader 动态创建 style 标签,将 css 插入到 head 中.
    css-loader 负责处理 @import 等语句。
    postcss-loader 和 autoprefixer,自动生成浏览器兼容性前缀 —— 2020了,应该没人去自己徒手去写浏览器前缀了吧
    less-loader 负责处理编译 .less 文件,将其转为 css
### 8. 图片、字体处理 url-loader、file-loader,下载url-loader,需要依赖file-loader
      如果index.html需要引入本地图片,html-withimg-loader
### 9. 入口配置

### 10. 出口配置
    publicPath配置意义？
### 11. 打包前清空目录,clean-webpack-plugin
      cleanOnceBeforeBuildPatterns:['**/*', '!dll', '!dll/**'] //不删除dll目录下的文件
### 12. 静态资源拷贝：直接引入已有的css、js等文件（本地）, 不需要webpack编译,比如reset.css
      npm install copy-webpack-plugin -D
      new CopyWebpackPlugin([
          {
              from: 'public/js/*.js',
              to: path.resolve(__dirname, 'dist', 'js'),
              // flatten 这个参数,设置为 true,那么它只会拷贝文件,而不会把文件夹路径都拷贝上
              flatten: true,
          }
      ], {
          ignore: ['other.js']
      })
### 13. 提供全局变量：ProvidePlugin,,不要过度使用
    new webpack.ProvidePlugin({
        React: 'react',
        Component: ['react', 'Component'],
        Vue: ['vue/dist/vue.esm.js', 'default'],
        $: 'jquery',
        _map: ['lodash', 'map']
    })
    另外,就是如果你项目启动了 eslint 的话,记得修改下 eslint 的配置文件,增加以下配置：
    {
        "globals": {
            "React": true,
            "Vue": true,
            //....
        }
    }
### 14. 抽离css, 将css单独打包（生产环境才需要）
    npm install mini-css-extract-plugin -D
    mini-css-extract-plugin 和 extract-text-webpack-plugin 相比:
    异步加载
    不会重复编译(性能更好)
    更容易使用
    只适用CSS

### 15. 按需加载
      要支持 import() 语法，需要增加 babel 的配置，安装依赖:
      npm install @babel/plugin-syntax-dynamic-import -D
      .babelrc的配置
      {
        "presets": ["@babel/preset-env"],
        "plugins": [
            [
                "@babel/plugin-transform-runtime",
                {
                    "corejs": 3
                }
            ],
            "@babel/plugin-syntax-dynamic-import"
        ]
      }
### 16. 热更新
    首先配置 devServer 的 hot 为 true
    并且在 plugins 中增加 new webpack.HotModuleReplacementPlugin()
    在入口文件中新增:
    if(module && module.hot) {
        module.hot.accept()
    }

### 17. 多页应用打包
    HtmlWebpackPlugin
    plugins: [
      new HtmlWebpackPlugin({
          template: './public/index.html',
          filename: 'index.html', //打包后的文件名
          chunks: ['index']
      }),
      new HtmlWebpackPlugin({
          template: './public/login.html',
          filename: 'login.html', //打包后的文件名
          chunks: ['login']
      }),
    ]

### 18. resolve配置
    resolve 配置 webpack 如何寻找模块所对应的文件。

#### 1. modules

    resolve.modules 配置 webpack 去哪些目录下寻找第三方模块，默认情况下，只会去 node_modules 下寻找
    resolve: {
      modules: ['./src/components', 'node_modules'] //从左到右依次查找
    }
#### 2. alias
    resolve: {
        alias: {
            'react-native': '@my/react-native-web' //这个包名是我随便写的哈
        }
    }
    import { View, ListView, StyleSheet, Animated } from 'react-native';
#### 3.extensions

适配多端的项目中，可能会出现 .web.js, .wx.js，例如在转web的项目中，我们希望首先找 .web.js，如果没有，再找 .js。我们可以这样配置:

//webpack.config.js
module.exports = {
    //....
    resolve: {
        extensions: ['web.js', '.js'] //当然，你还可以配置 .json, .css
    }
}
#### 4.enforceExtension

如果配置了 resolve.enforceExtension 为 true，那么导入语句不能缺省文件后缀。
#### 5.mainFields

有一些第三方模块会提供多份代码，例如 bootstrap，可以查看 bootstrap 的 package.json 文件：

{
    "style": "dist/css/bootstrap.css",
    "sass": "scss/bootstrap.scss",
    "main": "dist/js/bootstrap",
}
resolve.mainFields 默认配置是 ['browser', 'main']，即首先找对应依赖 package.json 中的 brower 字段，如果没有，找 main 字段。

如：import 'bootstrap' 默认情况下，找得是对应的依赖的 package.json 的 main 字段指定的文件，即 dist/js/bootstrap。

假设我们希望，import 'bootsrap' 默认去找 css 文件的话，可以配置 resolve.mainFields 为:

//webpack.config.js
module.exports = {
    //....
    resolve: {
        mainFields: ['style', 'main'] 
    }
}
### 19. webpack-merge

### 20. 定义环境变量 DefinePlugin

### 21. 前端模拟数据
        npm install mocker-api -D
安装 mocker-api:

npm install mocker-api -D
在项目中新建mock文件夹，新建 mocker.js.文件，文件如下:

module.exports = {
    'GET /user': {name: '刘小夕'},
    'POST /login/account': (req, res) => {
        const { password, username } = req.body
        if (password === '888888' && username === 'admin') {
            return res.send({
                status: 'ok',
                code: 0,
                token: 'sdfsdfsdfdsf',
                data: { id: 1, name: '刘小夕' }
            })
        } else {
            return res.send({ status: 'error', code: 403 })
        }
    }
}
修改 webpack.config.base.js:

const apiMocker = require('mocker-api');
module.export = {
    //...
    devServer: {
        before(app){
            apiMocker(app, path.resolve('./mock/mocker.js'))
        }
    }
}
这样，我们就可以直接在代码中像请求后端接口一样对mock数据进行请求。

重启 npm run dev，可以看到，控制台成功打印出来 {name: '刘小夕'}

我们再修改下 src/index.js，检查下POST接口是否成功

//src/index.js
fetch("/login/account", {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: "admin",
        password: "888888"
    })
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
可以在控制台中看到接口返回的成功的数据。