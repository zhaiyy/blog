下一代 Web 应用应用模型Progressive Web App（PWA）- Service Worker
==========
 <div style="text-align: right">  2019/08/30 </div>

# 背景
Web 应用的现状
1. 网络资源下载带来的网络延迟
2. Web 应用依赖于浏览器作为入口
3. 没有很好的离线使用方案
4. 没有好的消息通知方案
5. ….

针对以上问题，结局方案出现了PWA

# PWA简介
PWA全称Progressive Web App，即渐进式WEB应用。
一个 PWA 应用首先是一个网页, 可以通过 Web 技术编写出一个网页应用. 随后添加上 App Manifest 和 Service Worker 来实现 PWA 的安装和离线等功能
# PWA主要特点
* 可靠-即使在不稳定的网络环境下，也能瞬间加载并展现
* 体验-快速响应，并且有平滑的动画响应用户的操作
* 粘性-像设备上的原生应用，具有沉浸式的用户体验，用户可以添加到桌面

# PWA特点的实现
* 可靠-离线缓存- Service Worker
* 体验-web 存储- App Shell 模型
* 粘性-吸引留住用户（添加到主屏幕和网络推送通知）- manifest.json

# Service Worker
Service Worker 是浏览器在后台独立于网页运行的脚本，它打开了通向不需要网页或用户交互的功能的大门。
Service Worker从英文翻译过来就是一个服务工人，服务于前端页面的后台线程，基于Web Worker实现。有着独立的js运行环境，分担、协助前端页面完成前端开发者分配的需要在后台悄悄执行的任务。

![](https://user-gold-cdn.xitu.io/2019/8/30/16ce22325749c171?w=796&h=362&f=jpeg&s=43044)
客户端访问，通过Service Worker 服务，判断请求内容从哪里取的，如果缓存中存在，直接 取缓存，否则就走网络

# Service Worker功能
* 推送通知 — 激活沉睡的用户，推送即时消息、公告通知，激发更新等。如web资讯客户端、web即时通讯工具、h5游戏等运营产品。
* 离线缓存 — 可编程拦截代理请求和返回，缓存文件，缓存的文件可以被网页进程取到（包括网络离线状态），将H5应用中不变化的资源或者很少变化的资源长久的存储在用户端，提升加载速度、降低流量消耗、降低服务器压力
* 事件同步 — 确保web端产生的任务即使在用户关闭了web页面也可以顺利完成。如web邮件客户端、web即时通讯工具等。
* 定时同步 — 周期性的触发Service Worker脚本中的定时同步事件，可借助它提前刷新缓存内容。如web资讯客户端
# Service Worker特性

* Service Worker 是一种可编程网络代理，让您能够控制页面所发送网络请求的处理方式
* 它是一种 JavaScript Worker，无法直接访问 DOM
* 必须在 HTTPS 环境下才能工作
* Service Worker 广泛地利用了 promise，异步实现
* Service Worker 在不用时会被中止，并在下次有需要时重启， Service Worker线程中不能保存需要持久化的信息
# 浏览器支持情况

![](https://user-gold-cdn.xitu.io/2019/8/30/16ce224dd66457fa?w=1088&h=564&f=jpeg&s=136450)
看上图可以看出来，目前浏览器的支持情况还是很可观的，基本上市场占比很大的浏览器目前都是支持的，可喜可贺。
# 查看当前页面是否有Service Worker

![](https://user-gold-cdn.xitu.io/2019/8/30/16ce2257ef4b0470?w=1293&h=424&f=png&s=94186)
我们打开浏览器的控制台，查看Service Workers ,会给我们展示出所有已经支持Service Workers 的网站
# Service Worker 生命周期
主要包含六种状态 解析成功（parsed），正在安装（installing），安装成功（installed），正在激活（activating），激活成功（activated），废弃（redundant）。

![](https://user-gold-cdn.xitu.io/2019/8/30/16ce226387d546dd?w=904&h=316&f=jpeg&s=36373)
* 解析成功（Parsed）：首次注册 Service Worker 时，浏览器解决脚本并获得入口点，如果解析成功，就可以访问到 Service Worker 注册对象（registration object）
* 正在安装（Installing）：解析完成后，浏览器会试着安装，进入下一状态，“installing”，在 installing 状态中，Service Worker 脚本中的 install 事件被执行
* 安装成功/等待中（Installed/Waiting）：如果安装成功，Service Worker * 进入安装成功（installed）（也称为等待中[waiting]）状态
* 正在激活（Activating）：处于 waiting 状态的 Service Worker，在以下之一的情况下，会被触发activating 状态：
  * 当前已无激活状态的 workerService 
  * Worker 脚本中的 self.skipWaiting() 方法被调用
  * 用户已关闭 Service Worker 作用域下的所有页面，从而释放了此前处于激活态的 worker
  * 超出指定时间，从而释放此前处于激活态的 worker
* 激活成功（Activated）：就可以应对事件性事件 —— fetch 和 message
* 废弃（Redundant）：
  * installing 事件失败
  * activating 事件失败
  * 新的 Service Worker 替换其成为激活态 worker
我们看一下在代码中是如何体现的
```javascript
// main.js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js')
            .then(function (registration) {

                // 注册成功
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                if (registration.installing) {
                    // Service Worker is Installing
                    console.log('Service Worker is Installing')
                } else if(registration.waiting) {
                    // 这是更新新版本或自动更新缓存的绝佳时机
                    /*
                    * 当前没有激活的 worker
                    * 如果在 Service Worker 的脚本中 self.skipWaiting() 被调用
                    * 如果用户访问其他页面并释放了之前激活的 worker
                    * 在一个特定的时间过去后，之前一个激活的 worker 被释放
                    */
                    console.log('Service Worker is Waiting')
                } else if(registration.active) {
                    // 激活成功, Service Worker 是一个可以完全控制网页的激活 worker
                    console.log('Service Worker is active')
                }
            })
            .catch(function (err) {

                // 注册失败:(
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

window.onload = function() {
    document.body.append('PWA!')
}
```
# Service Worker 事件

* Install：Service Worker 注册并安装完成后，对站点离线访问最关键的资源 URL 列表，它们通常也是关键请求链包含的文件，并将其缓存进 caches 中
* Activate：安装完成并激活后，一个管理老旧缓存的好地方， 在一般 PWA 中，我们可以结合版本号和缓存名，及时删除过期缓存
* Fetch：页面受控后所有请求会被 Service Worker “劫持”，根据资源类型动态返回缓存数据或请求新数据

![](https://user-gold-cdn.xitu.io/2019/8/30/16ce226e9eef0775?w=1104&h=314&f=jpeg&s=85604)

在代码中的具体实现
```javascript
// sw.js
/*
   sw.js 控制着页面资源和请求的缓存
*/

// 监听 service worker 的 install 事件,
// 对站点离线访问最关键的资源 URL 列表，它们通常也是关键请求链包含的文件，并将其缓存进 caches 中
self.addEventListener('install', function (e) {
    // 如果监听到了 service worker 已经安装成功的话，就会调用 event.waitUntil 回调函数
    e.waitUntil(
        caches.open('v1').then(cache => {
            // 通过 cache 缓存对象的 addAll 方法添加 precache 缓存
            return cache.addAll([
                '/main.js',
                '/index.html',
                '/'
            ]);
        }).then(function() {
          // 跳过waiting,直接进入active
          console.log('Skip waiting!')
          return self.skipWaiting()
        })
    );
});

/*
    事件回调是一个管理老旧缓存的好地方
    在一般 PWA 中，我们可以结合版本号和缓存名，及时删除过期缓存
*/
self.addEventListener('activate', function(e) {
  const cacheStorageKey = 'v1'
  e.waitUntil(
    Promise.all(
      caches.keys().then(cacheNames => {
        return cacheNames.map(name => {
          if (name !== cacheStorageKey) {
            return caches.delete(name)
          }
        })
      })
    ).then(() => {
      console.log('Clients claims.')
      // 通过clients.claim方法，更新客户端上的server worker
      return self.clients.claim()
    })
  )
})

/*
对不同资源类型应用不同的请求/缓存策略
看看这些请求所请求的文件在我们的缓存里有没有，有的话就直接从缓存里拿，不用下载了。
这也是PWA最重要的功能之一
*/
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            // 检测是否已经缓存过
            if (response) {
                return response;
            }

            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
                function (response) {
                    // 检测请求是否有效
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    var responseToCache = response.clone();

                    caches.open('v1')
                        .then(function (cache) {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }
            );
        })
    );
});

// 推送消息
self.addEventListener('message', function(event) {
  // Do stuff with postMessages received from document
    console.log("SW Received Message: " + event.data);
});

```
# 参考文档
* [讲讲PWA](https://segmentfault.com/a/1190000012353473)
* [PWA 文档](https://lavas.baidu.com/pwa)
* [Google 官方简介](https://developers.google.com/web/progressive-web-apps/)
* [Server worker 生命周期](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle?hl=zh-cn)

