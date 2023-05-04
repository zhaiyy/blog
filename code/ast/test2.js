/*
 * @Author: zhaiyingying001
 * @Date: 2023-05-04 18:23:25
 * @LastEditors: zhaiyingying001
 * @LastEditTime: 2023-05-04 18:24:40
 * @Description: 文件描述
 */
/** 实战二、 项目实战获取项目node页面对应入口文件 */
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
console.log('pageRenderPath', pageRenderPath)
