Single-Spa微前端实践
=========
 <div style="text-align: right">  2020/01/07 </div>
## 背景

在前端，往往由一个前端团队创建并维护一个 Web 应用程序，使用 REST API 从后端服务获取数据。这种方式如果做得好的话，它能够提供优秀的用户体验。但主要的缺点是单页面应用（SPA）不能很好地扩展和部署。中后台应用由于其应用生命周期长 (动辄 3+ 年) ，由于参与的人员、团队的增多、变迁，等特点从一个普通应用演变成一个巨石应用 ( Frontend Monolith ) 后，随之而来的应用不可维护的问题。这类问题在企业级 Web 应用中尤其常见。

在一个大公司里，单前端团队可能成为一个发展瓶颈。

## 什么是微前端架构？
首先，必须先了解什么是微前端架构。
微前端架构是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将 Web 应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。

![](https://user-gold-cdn.xitu.io/2020/1/7/16f7fdfed27b6dd6?w=918&h=818&f=jpeg&s=44488)

## Single spa什么？
single spa是一个javascript库，允许许多小应用程序在一个页面应用程序中共存。这个https://single-spa.surge.sh/
网站是一个演示应用程序，展示了什么单一应用。spa的理念是让独立的、独立的应用程序组成一个完整的页面。单spa并没有长期依赖于单个框架和每个特性，而是帮助您在开发新框架时采用它们。
简单来说就是一个万能的粘合剂，使用这个库可以让你的应用可以使用多个不同的技术栈（vue、react、angular等等）进行同步开发，最后使用一个公用的路由即可实现完美切换。当然了，也可以使用一样的技术栈，分不同的团队进行开发，只需要最后使用这个库将其整合在一起，设置不用的路由名称即可。


![](https://user-gold-cdn.xitu.io/2020/1/7/16f7fe1d23752b06?w=804&h=382&f=jpeg&s=83675)

## 如何开始一个Single spa 项创建项目parent 

### 第一步、新建项目

修改app.vue 文件 添加 

`<div id=“vue”></div>`  容器

引入安装包文件

`npm install single-spa --save –d`

Main.js 引入配置文件

 `import './single-spa-config.js’`
 
2. 创建子项目vue-child

引入装包文件

`npm install single-spa-vue --save -d`


### 第二步、 父组件single-spa-config 文件
首先了解一下singleSpa 主要的API
* registerApplication
定义： 

registerApplication is the most important api your root config will use. Use this function to register any application within single-spa.  --- 注册子项目的方法

appName: 子项目名称

applicationOrLoadingFn: 子项目注册函数，用户需要返回
single-spa 的生命周期对象。后面我们会介绍single-spa的生命周期机制

activityFn: 回调函数入参 location 对象，可以写自定义匹配路由加载规则。
调用方法

```javascript
singleSpa.registerApplication('appName’,
 () => System.import('appName’), 
location => location.pathname.startsWith('appName’)
)


```

* singleSpa.start：启动函数

修改父容器的single-spa-config 文件

``` javascript
  // single-spa-config.js
  import * as singleSpa from 'single-spa'; //导入single-spa
  import axios from 'axios’
  
  /*runScript：一个promise同步方法。可以代替创建一个script标签，然后加载服务*/
  const runScript = async (url) => {
  return new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = url;
  script.onload = resolve;
  script.onerror = reject;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
  });
  };
  singleSpa.registerApplication( //注册微前端服务
      'singleDemo', 
  async () => {
  await runScript('http://127.0.0.1:3000/js/chunk-vendors.js');
  await runScript('http://127.0.0.1:3000/js/app.js'); 
  return window.singleVue;
  },
  location => location.pathname.startsWith('/vue-antd') // 配置微前端模块前缀
  );
  singleSpa.start(); // 启动

```

### 第三步、注册子组件
修改父项目的main.js
```javascript
  import Vue from 'vue'
  import App from './App.vue'
  import singleSpaVue from "single-spa-vue"
  
  const vueOptions = {
  el: "#vue",
  render: h => h(App),
  }
  // new Vue().$mount('#app')
  // singleSpaVue包装一个vue微前端服务对象
  const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: vueOptions
  });
  // 导出生命周期对象
  export const bootstrap = vueLifecycles.bootstrap; // 启动时
  export const mount = vueLifecycles.mount; // 挂载时
  export const unmount = vueLifecycles.unmount; // 卸载时
  export default vueLifecycles;

```

### single-spa生命周期
生命周期函数共有4个：bootstrap、mount、unmount、update。生命周期可以传入 返回Promise的函数也可以传入 返回Promise函数的数组。
```javascript

  export default { 
    // app启动 
    Bootstrap: [() => Promise.resolve()],
     // app挂载 
    Mount: [() => Promise.resolve()],
     // app卸载 
    Unmount: [() => Promise.resolve()], 
    // service更新，只有service才可用
     update: [() => Promise.resolve()]
  }

```

![](https://user-gold-cdn.xitu.io/2020/1/7/16f7fe54b1234fbb?w=882&h=682&f=jpeg&s=115432)

### 第五步、自动加载 bundle和chunk.vendor
在上面父项目加载子项目的代码中，我们可以看到。我们要注册一个子服务，需要一次性加载2个JS文件。如果需要加载的JS更多，甚至生产环境的 bundle 有唯一hash， 那我们还能写死文件名和列表吗？我们的实现思路，就是让子项目使用 stats-webpack-plugin 插件，每次打包后都输出一个 只包含重要信息的manifest.json文件。父项目先ajax 请求 这个json文件，从中读取出需要加载的js目录，然后同步加载。

![](https://user-gold-cdn.xitu.io/2020/1/7/16f7fe44d9070eda?w=868&h=510&f=jpeg&s=37562)

子项目添加vue.config.js ，并进行以下修改,生成manifest.json 文件

```javascript
  const StatsPlugin = require('stats-webpack-plugin');
  module.exports = {
  ….
    output: {
    library: "singleVue", // 导出名称
    libraryTarget: "window", //挂载目标
    },
    /**** 添加开头 ****/
    plugins: [
    new StatsPlugin('manifest.json', {
    chunkModules: false,
    entrypoints: true,
    source: false,
    chunks: false,
    modules: false,
    assets: false,
    children: false,
    exclude: [/node_modules/]
    })
    ]
    /**** 添加结尾 ****/
  ….
  };
  

```

当然，父项目中的单runScript已经无法支持使用了，写个getManifest方法，处理一下。

```javascript

  const getManifest = (url, bundle) => new Promise(async (resolve) => {
    const { data } = await axios.get(url);
    // eslint-disable-next-line no-console
    const { entrypoints, publicPath } = data;
    const assets = entrypoints[bundle].assets;
    for (let i = 0; i < assets.length; i++) {
    await runScript(publicPath + assets[i]).then(() => {
    if (i === assets.length - 1) {
    	resolve()
    }
    })
    }
  });

```
我们首先ajax到 manifest.json 文件，解构出里面的 entrypoints publicPath字段，遍历出真实的js路径，然后按照顺序加载。

```javascript

async () => {
  let singleVue = null;
  await getManifest('http://127.0.0.1:3000/manifest.json', 'app').then(() => {
  	singleVue = window.singleVue;
  });
  return singleVue; 
},

```
### 第六步、添加另一个新项目
Vue-child 引入 ant UI 
Vue-child-two 引入 element

同样可以使用多个不同的技术栈（vue、react、angular等等）进行同步开发

## Single spa 优点
* 敏捷性 - 独立开发和更快的部署周期：
 开发团队可以选择自己的技术并及时更新技术栈。
一旦完成其中一项就可以部署，而不必等待所有事情完毕。
* 降低错误和回归问题的风险，相互之间的依赖性急剧下降。
* 更简单快捷的测试，每一个小的变化不必再触碰整个应用程序。
* 更快交付客户价值，有助于持续集成、持续部署以及持续交付。

## 参考文章

[single-spa 文档](https://single-spa.js.org/docs/getting-started-overview/)

[微前端 single-spa](https://juejin.im/post/5d3925615188257f3850de5a)

[这可能是你见过最完善的微前端解决方案！](https://www.infoq.cn/article/o6GxRD9iHQOplKICiDDU)

[single-spa微前端](http://www.soulapp.tech/2019/09/25/single-spa%E5%BE%AE%E5%89%8D%E7%AB%AF/)

[Single-Spa + Vue Cli 微前端落地指南 (项目隔离远程加载，自动引入)](https://juejin.im/post/5dfd8a0c6fb9a0165f490004)


项目完整地址：https://github.com/zhaiyy/single-spa.git

