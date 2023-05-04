# 什么是AST

抽象语法树（abstract syntax tree或者缩写为AST），或者语法树（syntax tree），是源代码的抽象语法结构的树状表现形式。一个 AST 只包含**与分析源文本有关的信息**，而**跳过**任何其他在解析文本时使用的**额外内容**（例如什么分号，函数参数中的逗号之类的对程序没有意义的东西）

AST 整个解析过程分为两个步骤

词法分析 (Lexical Analysis)：扫描输入的源代码字符串，生成一系列的词法单元 (tokens)。这些词法单元包括数字，标点符号，运算符等。词法单元之间都是独立的，也即在该阶段我们并不关心每一行代码是通过什么方式组合在一起的。  
语法分析 (Syntax Analysis)：建立分析语法单元之间的关系 

那抽象语法树究竟是什么样子？

我们以一个简单的例子

5 + (1 x 12)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39b8e7716cf840d1b3b05fe66b1415dd~tplv-k3u1fbpfcp-watermark.image?)

# AST 有什么用

-   IDE 的错误提示、代码格式化、代码高亮、代码自动补全等
-   JSLint、JSHint 对代码错误或风格的检查等
-   webpack、rollup 进行代码打包等
-   CoffeeScript、TypeScript、JSX 等转化为原生 Javascript.
-   vue 模板编译、react 模板编译

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4048383ea31248e8ac91b2ca7fc95673~tplv-k3u1fbpfcp-watermark.image?)
# AST 语法

以下是 JavaScript 的一些常见 AST 语法：

[https://github.com/estree/estree](https://github.com/estree/estree "https://github.com/estree/estree")


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efaf85bc0708410a827de8d1dc3cbe7f~tplv-k3u1fbpfcp-watermark.image?)
<https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API#node_objects>

语法树小工具：<https://astexplorer.net/>

为了方便大家理解抽象语法树，来看看具体的例子。

我们以上面 5 + (1 * 12) 为例，看一下实际解析的内容


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7966686473594a90a0763bc74846b4ce~tplv-k3u1fbpfcp-watermark.image?)

```json
{
  "type": "Program",
  "sourceType": "script",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "BinaryExpression",
        "left": {
          "type": "Literal",
          "value": 5
        },
        "right": {
          "type": "BinaryExpression",
          "left": {
            "type": "Literal",
            "value": 1
          },
          "right": {
            "type": "Literal",
            "value": 12
          },
          "operator": "*"
        },
        "operator": "+"
      }
    }
  ]
}
```

# AST 工具对比



| 名称   | 简介   | 特性  |  
| --- | --- |--- |                                                                     
| Esprima      | 开源的工具，拥有解析 JavaScript 代码的广泛应用和成功的案例。速度和兼容性良好，支持 ECMAScript6，并且可透过插件协助封装在其它工具中。它也允许用户自定义插件功能，从而满足更复杂的需求。   |1、[esprima](https://esprima.org/)是比较早的一个parser,高性能，符合标准，支持es7 <br>2、 **只支持解析JavaScript代码，不支持ts，flow** *   parseModule支持parse一个es的module<br>3、parseScript(‘var el= ‘, { jsx: true }); 可以支持解析jsx，但是没办法parse一个含有jsx的module<br>4、 [ast format](https://esprima.readthedocs.io/en/4.0/syntax-tree-format.html),从[Mozilla Parser API,](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API)继承而来，并且最终扩展为[ESTree format](https://github.com/estree/estree)   |                                                                                                                                 |
| Acorn        | 性能很出色，允许接入更高级的 ES Syntax，最近几年已经成为非常受欢迎的解析器之一。   |1、 [acorn](https://github.com/acornjs/acorn): A tiny, fast JavaScript parser, written completely in JavaScript<br>2、支持插件扩展，所以可以基于acorn，扩展出解析各种JavaScript代码<br>3、 [acorn-walk](https://github.com/acornjs/acorn/tree/master/acorn-walk)用来遍历ast的node<br>4、 AST格式是 ESTree format|
| Babel Parser | Babel 的语法分析器，允许支持不同于常见的 JavaScript 语法的开发语言（如JSX）。兼容 ES6 和 ES7，并已经处理了 TC39 最新的语法变化。同时具有兼容性，易于扩展的优点。而 babel 目前所用的解析器 fork 自 acorn。webpack 的核心 parser 也是 acorn。而 eslint 作为一个可配置的代码规范检查工具，可以任意选择定义解析器来使用 | -   [babel/parser](https://babeljs.io/docs/en/babel-parser),以前叫Babylon，底层依赖acorn,jsx的支持是也是用的[acorn的插件acorn-jsx](https://github.com/acornjs/acorn-jsx)<br>-   使用插件的方式，支持最新的es语法以及jsx,flow,ts，[所有插件](https://babeljs.io/docs/en/babel-parser#plugins)<br>-   [ast format](https://github.com/babel/babylon/blob/master/ast/spec.md)是基于ESTree改的。如果要使用estree格式，plugins中传入`estree`即可<br>-   `@babel/core`：Babel 编译器本身，提供了 babel 的编译 API；<br>-   `@babel/parser`：将 JavaScript 代码解析成 AST 语法树；<br>-   `@babel/traverse`：遍历、修改 AST 语法树的各个节点；<br>-   `@babel/generator`：将 AST 还原成 JavaScript 代码；<br>-   `@babel/types`：判断、验证节点的类型、构建新 AST 节点等。 |
| recast       | 一大特色就是在print的时候会尽量的保持源代码的格式，输出时只会重新输出有修改的ast，未更改过的ast，会直接按原样输出。所以非常适合那些需要修改源码，并且要把修改后的结果覆写到源码的情况。但是前提是需要使用recast的parser，不要在print的时候使用一个用别的工具parse出来的ast                                              | -   [recast](https://github.com/benjamn/recast) 默认使用esprima作为parser,支持传入自定义parser，比如babel/parser，recast也提供了便捷的方式来使用其他parser，[所有parser地址](https://github.com/benjamn/recast/tree/master/parsers)。要使用其他parser，需自己安装对应的parser包，安装recast时只会自动安装默认的exprima<br>-   print支持[格式化参数](https://github.com/benjamn/recast/blob/master/lib/options.ts#L167)，比如单双引号，换行符之类的。<br>-   使用[ast-types](https://github.com/benjamn/ast-types)作为ast的格式，这个是继承自Mozilla Parser API，但是兼容esprima的<br>-   因为默认的esprima不支持jsx，所以在react项目中，就需要使用babel的parser|
| Escodegen    | 代码生成器工具，它支持将 JavaScript AST 转换回源代码。它和 Esprima 配合使用，可以将 AST 转换为对应的代码。但是由于它对代码生成的方式进行了多个策略的优| |

针对目前我们项目的特点，目前采用Babel Parser 进行解析，可进行多种语法转换处理，使用成本小，学习成本小，前端项目之间没有壁垒
```js
require("@babel/parser").parse("let a = 1", {
  sourceType: "module"
});
```
# 实战

## 实战一、eslint 代码格式化功能，把 let 替换成 const 
[源码](../code/ast/test1.js)

备注：仅体验替换逻辑，不关注是否需要替换的逻辑判断
```js
var obj = {
  fn(){
    console.log("hello")
  }
}
```

```js
const parser = require('@babel/parser') // 用于将代码转换为 AST
const traverse = require('@babel/traverse').default // 用于对 AST 的遍历，包括节点增删改查、作用域等处理
const generate = require('@babel/generator').default // 用于将 AST 转换成代码
const t = require('@babel/types') // 用于 AST 节点操作的 Lodash 式工具库,各节点构造、验证等
 
const sourceCode = `
var obj = {
    fn(){
      console.log("hello")
    }
  }
`
const ast = parser.parse(sourceCode)
traverse(ast, {
  VariableDeclaration(path) {
    const { kind } = path.node
    if (kind === 'var') {
      path.node.kind = 'const'
    }
  }
})
const newCode = generate(ast).code
console.log(newCode)
/**
* 打印信息
*
const obj = {
  fn() {
    console.log("hello");
  }
};
*/
```

## 实战二、 项目实战获取项目node页面对应入口文件 
[源码](../code/ast/test2.js)

解析出 common/web-login-v2/index 

```js
export default {
  needLogin: false,
  async handler(ctx) {
    const { originalUrl } = ctx.request.query
    const renderContent = await kssr.render('common/web-login-v2/index', {
      originalUrl: originalUrl
    })
    ctx.body = renderContent.body
  }
}
```

**以下是这段代码的ast 数形json**  展开源码

解析代码

```js
const parser = require('@babel/parser') // 用于将代码转换为 AST
const traverse = require('@babel/traverse').default // 用于对 AST 的遍历，包括节点增删改查、作用域等处理
 
const sourceCode = `
export default {
  needLogin: false,
  async handler(ctx) {
    const { originalUrl } = ctx.request.query
    const renderContent = await kssr.render('common/web-login-v2/index', {
      originalUrl: originalUrl
    })
    ctx.body = renderContent.body
  }
}
`
const ast = parser.parse(sourceCode, { sourceType: 'module' })
let pageRenderPath = ''
traverse(ast, {
  CallExpression(nodePath) {
    const memberExp = nodePath.get('callee')
    const memberProperty = memberExp.get('property')
    if (
      memberExp.inType('MemberExpression') &&
      memberProperty.node &&
      memberProperty.node.name === 'render'
    ) {
      pageRenderPath = nodePath.get('arguments.0').toString()
    }
  }
})
console.log('pageRenderPath', pageRenderPath) // pageRenderPath 'common/web-login-v2/index'
```
## 实战三、 项目实战接口请求添加catch
[源码](../code/ast/test3.js)

```js
/** 优雅的代码，添加catch **/
postApi('/install-repairer/api/sign-in', params)
  .then(res => {
    if (res && res.code === 2000) {
      Toast.info('成功', 1)
    } else {
      Toast.info(res.message || '网络异常，请重试')
    }
  })
  .catch(e => {
    Toast.info(e.message || '签到失败，请稍后重试')
  })
 
/**不优雅的代码，没有catch **/
loginApi.getUserList({ keyWord: value }).then(res => {
  if (res && res.code === 2000) {
    Toast.info('成功', 1)
  } else {
    Toast.info(res.message || '请求异常，请稍后重试', 1)
  }
})
```
```js
const parser = require('@babel/parser') // 用于将代码转换为 AST
const traverse = require('@babel/traverse').default // 用于对 AST 的遍历，包括节点增删改查、作用域等处理
const generate = require('@babel/generator').default // 用于将 AST 转换成代码
 
const sourceCode = `
postApi('/install-repairer/api/sign-in', params)
  .then(res => {
    if (res && res.code === 2000) {
      Toast.info('成功', 1)
    } else {
      Toast.info(res.message || '网络异常，请重试')
    }
  }).catch(e => {
    Toast.info(e.message || '签到失败，请稍后重试')
  })
 
 
loginApi.getUserList({ keyWord: value }).then(res => {
  if (res && res.code === 2000) {
    Toast.info('成功', 1)
  } else {
    Toast.info(res.message || '请求异常，请稍后重试', 1)
  }
})
`
 
const insertCode = `
test().then().catch(e => {
    Toast.info(e.message || '请求异常，请稍后重试')
  })`
 
const ast = parser.parse(sourceCode, { sourceType: 'module' })
traverse(ast, {
  CallExpression(nodePath) {
    const memberExp = nodePath.get('callee')
    const memberProperty = memberExp.get('property')
    if (
      memberProperty.node &&
      memberProperty.node.name === 'then' &&
      nodePath.parent.type !== 'MemberExpression'
    ) {
      const insertAst = parser.parse(insertCode, { sourceType: 'module' })
      traverse(insertAst, {
        CallExpression(nodePathInsert) {
          const memberExpInsert = nodePathInsert.get('callee')
          const memberPropertyInsert = memberExpInsert.get('property')
 
          if (
            memberPropertyInsert.node &&
            memberPropertyInsert.node.name === 'catch' &&
            memberExpInsert.node.type === 'MemberExpression'
          ) {
            nodePathInsert.node.callee.object = { ...nodePath.node }
            nodePath.container.expression = nodePathInsert.node
          }
        }
      })
    }
  }
})
 
const newCode = generate(ast).code
console.log(newCode)
/**
控制台输出 结果
postApi('/install-repairer/api/sign-in', params).then(res => {
  if (res && res.code === 2000) {
    Toast.info('成功', 1);
  } else {
    Toast.info(res.message || '网络异常，请重试');
  }
}).catch(e => {
  Toast.info(e.message || '签到失败，请稍后重试');
});
loginApi.getUserList({
  keyWord: value
}).then(res => {
  if (res && res.code === 2000) {
    Toast.info('成功', 1);
  } else {
    Toast.info(res.message || '请求异常，请稍后重试', 1);
  }
}).catch(e => {
  Toast.info(e.message || '请求异常，请稍后重试');
});
*
*/
```

# 缺点:

1.  转换过程复杂:AST 需要将 JavaScript 代码转换为树形结构，这需要大量的计算和处理，因此转换过程可能比较耗时。
1.  不支持部分转换:AST 只能转换整个代码块，不能对代码块进行部分转换。这意味着如果代码块包含复杂的结构，如嵌套函数或条件语句，则可能需要对代码块进行拆分，以便在不同的部分中使用 AST。
1.  可能会丢失信息:AST 是一种抽象结构，它不会保留原始 JavaScript 代码中的所有信息。例如，函数调用语句中的参数不会在 AST 中显示，只会保留函数名和调用点。
1.  节点查找困难，由于ast 使用树形结构，针对复杂一点的代码模块想要针对某一个代码进行解析或替换操作比较困难，操作路径太长
1.  难以调试：使用 AST 进行解析可能会导致代码难以理解和调试。因为 AST 是一种抽象结构，它不会显示原始 JavaScript 代码中的所有信息，因此需要对代码进行进一步的解析和理解，以便进行调试。
1.  对源代码书写格式要求相对严格，虽然对于正则匹配来说ast 也可以针对代码进行不同类型参数查找，会相对简单，但是由于一些项目不同的业务逻辑导致不同的使用方式，比如针对接口请求会有post 请求方式，proxy 代理请求方式，有些方法名会有变量赋值或者逻辑判断等，都会增加代码查找或者替换的复杂度

# 参考文档

-   非官方自行编写@Babel/traverse API文档 <https://github.com/RecluseXU/Babel-traverse-api-doc>
-   Javascript-Babel-AST-基础 <https://evilrecluse.top/post/7389a59f/>
-   AST笔记(技巧，插件)————持续更新<https://www.jianshu.com/p/a3857fa5c899>
-   [入门 AST 抽象语法树  https://111hunter.github.io/2020-08-23-ast/](https://111hunter.github.io/2020-08-23-ast/) 
-   ast 解析 <https://astexplorer.net/>
-   [JavaScript AST抽象语法树常见节点及结构. http://www.z2blog.com/archives/10](https://www.z2blog.com/archives/10)