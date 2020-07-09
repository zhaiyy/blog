# webpack 打包优化
 <div style="text-align: right">  2018/10/26 </div>

## 体积篇

### 1、初始状态

![](https://user-gold-cdn.xitu.io/2018/10/26/166af7e98ccd2a8a?w=1346&h=492&f=png&s=127744)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af834b2dd8b75?w=1272&h=77&f=png&s=18113)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af83c221aaaee?w=1910&h=960&f=png&s=462974)
### 2\. router 按需加载

最后修改router.js,将所有路由都改为动态加载

```
//router.js

//原来的写法：import Home from '@/components/PC/Home'
//改成下面这种形式（其他路由同理）
const Home = () => import('@/components/PC/Home') 

```


![](https://user-gold-cdn.xitu.io/2018/10/26/166af8a6441b29ed?w=1362&h=944&f=png&s=272654)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af8aaac6191a5?w=1418&h=148&f=png&s=38631)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af8aeba644ab2?w=1907&h=970&f=png&s=400001)

### 3.添加dll

新增webpack.dll.conf.js 文件
 Dll打包以后是独立存在的，只要其包含的库没有增减、升级，hash也不会变化，因此线上的dll代码不需要随着版本发布频繁更新。

App部分代码修改后，只需要编译app部分的代码，dll部分，只要包含的库没有增减、升级，就不需要重新打包。这样也大大提高了每次编译的速度。

假设你有多个项目，使用了相同的一些依赖库，它们就可以共用一个dll

```
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'none',
    entry: {
        vue: ['vue/dist/vue.js', 'vue', 'vue-router', 'vuex'],
        comment: ['jquery', 'lodash', 'jquery/dist/jquery.js']
    },
    output: {
        path: path.join(__dirname, '../static/dll/'),
        filename: '[name].dll.js',
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, '../static/dll/', '[name]-manifest.json'),
            name: '[name]'
        })
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin()
        ]
    }
};

```

执行命令，生产dll json
 `webpack --config config/webpack.dll.conf.js`

util.js plugins 添加

```
  new webpack.DllReferencePlugin({
            manifest: require('../static/dll/vue-manifest.json')
        }),

        new webpack.DllReferencePlugin({
            manifest: require('../static/dll/comment-manifest.json')
        })

```

index.html 添加文件连接

```
        <script src="/static/dll/vue.dll.js"></script>
        <script src="/static/dll/comment.dll.js"></script>

```


![](https://user-gold-cdn.xitu.io/2018/10/26/166af8b686d258cb?w=1426&h=884&f=png&s=255704)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af8b9cbc4b70e?w=1600&h=498&f=png&s=201271)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af8be684ad85a?w=1290&h=163&f=png&s=47852)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af8c1f3515307?w=1907&h=960&f=png&s=653039)
### 4.添加SplitChunksPlugin

提取node\_modules 初始化模块，并设置缓存

```
 optimization: {
        splitChunks: {
            chunks: 'all',
            minChunks: 3,
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10,
                    enforce: true
                }
            }
        }
    },

```


![](https://user-gold-cdn.xitu.io/2018/10/26/166af8c995e829e4?w=1212&h=958&f=png&s=281491)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af8cc1fab2d2a?w=1270&h=133&f=png&s=30831)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af8d1276aaa5b?w=2554&h=1374&f=png&s=633694)
### 5.提取css

```
 {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader'
            ]
        }

```

```
 new MiniCssExtractPlugin({
            filename: isBuild? 'css/[name].css':'css/[name]_[hash].css'
        })

```


![](https://user-gold-cdn.xitu.io/2018/10/26/166af8ec21ab9908?w=1288&h=758&f=png&s=205032)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af8efa7c889ca?w=1320&h=139&f=png&s=30284)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af8f1d9b34c59?w=1303&h=171&f=png&s=33694)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af8f50eee3074?w=1290&h=195&f=png&s=51053)
### 5.提取element ui

```
 element: {
                    test: /node_modules\/element-ui/,
                    chunks: 'initial',
                    name: 'element',
                    priority: 10,
                    enforce: true
                },

```

```
 new HtmlWebpackPlugin({
            template: './pages/index.html',
            chunks: ['vendor', 'app', 'element']
        })

```


![](https://user-gold-cdn.xitu.io/2018/10/26/166af8fc9f9e2c3f?w=1384&h=758&f=png&s=229800)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af8ffa9c89d0d?w=2386&h=192&f=png&s=79502)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af902864d2691?w=1278&h=197&f=png&s=41849)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af906b47d58ea?w=1902&h=960&f=png&s=431660)
### 6.按需加载babel-polyfill

babel-polyfill的缺点
 使用后打包后的体积很大，因为babel-polyfill是一个整体，把所有方法都加到原型链上。比如我们只使用了Array.from，但它把Object.defineProperty也给加上了，这就是一种浪费了。
 使用@babel/runtime和@babel/plugin-transform-runtime
 用插件后，Babel就会使用babel@runtime下的工具函数，将Promise重写成\_Promise（只是打比方），然后引入\_Promise helper函数。这样就避免了重复打包代码和手动引入模块的痛苦。

.babel

```
 "plugins": [
      "@babel/plugin-transform-runtime"
    ]

```

polyfills.js 删除babel-polyfill

```
//import 'babel-polyfill';
//import "core-js/modules/es6.promise";

```


![](https://user-gold-cdn.xitu.io/2018/10/26/166af90d06bd7c51?w=1278&h=384&f=png&s=148137)
 ![](https://user-gold-cdn.xitu.io/2018/10/26/166af9108b3b65d6?w=3040&h=1092&f=jpeg&s=442546)

### 总结

![](https://user-gold-cdn.xitu.io/2018/10/26/166af9165311194e?w=2272&h=516&f=jpeg&s=315927)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af918e24b3b93?w=3831&h=984&f=jpeg&s=899760)

app.js 1.78M -\> 125k 体积减小 90%

vendor.js 324k -\> 208k 体积减小 35%

由之前的3个包 拆分打包成多个 ，按需加载。

## 速度篇

building modules chunk asset optimization

之前是 60s-70s 体积优化后稳定在 40-50s（稳定在45s左右） 提升速度 20% 左右

### 1.使用 webpack-parallel-uglify-plugin 插件来压缩代码

当 Webpack 有多个 JavaScript 文件需要输出和压缩时，原本会使用 UglifyJS 去一个个挨着压缩再输出， 但是 ParallelUglifyPlugin 则会开启多个子进程，把对多个文件的压缩工作分配给多个子进程去完成

```
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

 new ParallelUglifyPlugin({
                uglifyOptions: {
                    // 最紧凑的输出
                    beautify: false,
                    // 删除所有的注释
                    comments: false,
                    compress: {
                        warnings: false, // 警告开关
                        drop_console: true,
                        // 内嵌定义了但是只用到一次的变量
                        collapse_vars: true,
                        // 提取出出现多次但是没有定义成变量去引用的静态值
                        reduce_vars: true
                    }
                },
                sourceMap: false,
                parallel: true , // 并行处理打包文件
                cache: true // 使用缓存

            })

```
![](https://user-gold-cdn.xitu.io/2018/10/26/166af91effe56159?w=1308&h=600&f=png&s=125359)
[34.463, 38.368, 37.928, 36.127, 38.007] 平均 36.9786
 36s 缩短 添加后稳定在 30-40s 大约10s

### 2.用 Happypack 来加速代码构建

happypack把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程

```
 new HappyPack({
            id: 'babel',
            loaders: [
                {
                    loader: 'babel-loader',
                    query: '?cacheDirectory',
                    options: {
                        presets: ['@babel/env']
                    }
                }],
            threadPool: happyThreadPool,
            verbose: true
        }),

```

```
 {
            test: /\.js$/,
            include: [srcPath, iqiyiPath],
            exclude: /(node_modules|bower_components)/,
            loader: 'happypack/loader?id=babel'
        },

```

[35.357, 37.762, 44.798, 33.635, 33.427, 33.473, 32.468] 均值 35.845

```
  new HappyPack({
            id: 'vue-loader',
            loaders: ['vue-loader'],
            threadPool: happyThreadPool,
            verbose: true
        })

```

```
        {
            test: /\.vue$/,
            include: srcPath,
            loader: 'happypack/loader?id=vue-loader'
        },

```

[37.683, 39.648, 35.499, 35.108, 37.419, 35.862] 均值 36.869

```
 new HappyPack({
            id: 'css-loader',
            loaders: ['css-loader'],
            threadPool: happyThreadPool,
            verbose: true
        })

```

```
{
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                //'css-loader'
                'happypack/loader?id=css-loader'
            ]
        }

```

[ 39.394, 39.443, 35.080, 37.253 ,37.501, 35.632] 均值 37.383
 
![](https://user-gold-cdn.xitu.io/2018/10/26/166af924c8558428?w=1282&h=640&f=png&s=119023)
 [35.639, 36.382, 34.144, 33.420, 34.641, 32.504, 34.313] 34.434
 速度稳定在30-35之间，缩短大约 1-2s

### 3.添加babel cacheDirectory


![](https://user-gold-cdn.xitu.io/2018/10/26/166af927d4c0197c?w=314&h=840&f=png&s=58817)
![](https://user-gold-cdn.xitu.io/2018/10/26/166af92b41f67160?w=750&h=572&f=jpeg&s=66909)

### 4.devtool

devtool: 'source-map'
 构建速度: 25.133, 26.545, 25.956, 24.763, 26.953 ~ 25.869
 重新构建速度: 1.387, 1.632 ,1.872, 1.809, 0.932 ~ 1.526
 
|devtool |构建速度| 重新构建速度| 生产环境| 品质(quality) |
|----|----|----|----|----|
|eval |21.473 +++| 0.6822 +++| no |生成后的代码|
|cheap-eval-source-map |23.251 +| 0.8622 ++|no|转换过的代码（仅限行）|
|cheap-module-eval-source-map |24.9536 o| 1.124 ++| no|原始源代码（仅限行）|
|eval-source-map |24.161 -- |0.9534 + |no| 原始源代码|    
![](https://user-gold-cdn.xitu.io/2018/10/26/166af92eeee1810a?w=872&h=764&f=png&s=83525)

### 总结

最终打包速度从 60-70 降低到 30-35s 降低大约 20-25s 左右 提升速度大约 30% 左右
 开发速度 二次打包速度 从 2.7~2.9s 左右降低到 0.6～0.9s,大约提速2s ,提速 60%-70% 左右 devtoo：eval

左右降低到 0.8～1.3s, 平均1.124，大约提速1s ,提速 35% 左右 devtoo：cheap-module-eval-source-map