# 如何开发 Webpack loader 
 <div style="text-align: right">  2020/7/9 </div>
## 前言
![avatar](./../image/loader/图片1.png)
webpack 能把左侧各种类型的文件（webpack 把它们叫作「模块」）统一打包为右边被通用浏览器支持的文件
## 什么是 Loader ？
所谓 loader 只是一个导出为函数的 JavaScript 模块，是集成到webpack的文件处理方法，这些loader在webpack打包过程中，可以对指定类型的文件进行相应的处理，比如把less语法转换成浏览器可以识别的css语法，引入特定类型的文件（html），在js 模块直接import css 文件等等。
```javascript
module.exports = { 
    module: { 
        rules: [ 
            { test: /\.less$/, use: [‘style-loader’, ‘less-loader’] }, 
            { test: /\.ts$/, use: 'ts-loader' } 
        ]
    }
 }; 

```
## Loader的用法准则
* 单一职责，一个loader只做一件事情，这样设计的原因是因为，职责越单一，组合性就强，可配置性就好。
* 从右到左，链式执行，上一个loader的处理结果传给下一个loader接着处理
* 模块化，一个loader就是一个模块，单独存在不依赖其他的任何模块
* 在多次模块的转化之间，我们不应该在 loader 中保留状态。每个 loader 运行时应该确保与其他编译好的模块保持独立。
* 利用 loader-utils 包，提供了很多工具，最常用的获取传入 loader 的 options。除了 loader-utils 之外包还有 schema-utils 包，我们可以用 schema-utils 提供的工具，获取用于校验 options 的 JSON Schema 常量，从而校验 loader options
## Loader-基本用法
loader 是导出为一个函数的 node 模块。该函数在 loader 转换资源的时候调用。给定的函数将调用 loader API，并通过 this 上下文访问。
如下文，我们写一个空的 loader, 
```javascript
// first-loader.js
module.exports = function(source) {
   // 处理 source ...
   console.log(source)
   return source;
};

```
第一个 loader 的传入参数只有一个source： 资源文件(resource file)的内容

第一个loader 引入实例
```javascript
rules: [
           {
              test: /\.js$/,
              use: [{
                    //这里写 loader 名即可
              loader: path.resolve(__dirname, './config/first-loader.js'), 
              options: {/* ... */}
                }]
            }
	]

```
控制台运行结果
![avatar](./../image/loader/控制台运行结果.png)
## Loader-链式操作
loader支持链式调用
```javascript
 module: {
            rules: [
             {
                test: /\.js$/,
                use: ['third-loader', 'second-loader', 'first-loader']
            }
          ]
        },
        resolveLoader: {
            // 告诉 webpack 该去那个目录下找 loader 模块
            modules: ['node_modules', path.resolve(__dirname, 'config')]
        }

```