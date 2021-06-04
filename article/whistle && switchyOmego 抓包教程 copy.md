whistle && switchyOmego 抓包教程
=========================
 <div style="text-align: right">  2021/4/26 </div>
 
# 简介
whistle是基于Node实现的跨平台web调试代理工具，同类型的工具有Fiddler和Charles，主要用于查看、修改HTTP、HTTPS、Websocket的请求、响应，也可以作为HTTP代理服务器使用。

在使用了Fiddler、Charles以及whistle这三款代理工具之后，总结出来的whistle的优势有以下几点：

1. 配置简单：whistle的配置类似于系统hosts的配置，一切操作都可以通过配置实现，支持域名、路径、正则表达式、通配符、通配路径等多种匹配方式。
2. 支持扩展：whistle提供了插件扩展能力，通过插件可以新增whistle的协议实现更复杂的操作、也可以用来存储或监控指定请求、集成业务本地开发调试环境等等
3. 内置weinre：通过weinre可以修改调试移动端DOM结构、捕获页面异常等。
界面简单易懂：从界面来看，whistle的功能划分为了network（网络）、rules（规则）、values（数据）、pulgins（插件）四大模块，通过tab页签进行切换。
文档全面：whistle官网提供了详细的说明文档，工作中遇到的情况只要查阅文档都能解决。

作者：yolkpie
链接：https://juejin.cn/post/6930415221185970189
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
# 参考文档
* [whistle文档](http://wproxy.org/whistle/)
* [手把手教你接入前端热门抓包神器 - whistle](https://mp.weixin.qq.com/s?__biz=MzI1ODE4NzE1Nw==&mid=2247488739&idx=1&sn=d026ac0d064582c98e7171c2271e3ddf)