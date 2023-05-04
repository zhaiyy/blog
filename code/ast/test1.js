/*
 * @Author: zhaiyingying001
 * @Date: 2023-05-04 18:23:17
 * @LastEditors: zhaiyingying001
 * @LastEditTime: 2023-05-04 18:24:48
 * @Description: 文件描述
 */
/** 实战一、eslint 代码格式化功能，把 let 替换成 const  */

const parser = require('@babel/parser') // 用于将代码转换为 AST
const traverse = require('@babel/traverse').default // 用于对 AST 的遍历，包括节点增删改查、作用域等处理
const generate = require('@babel/generator').default // 用于将 AST 转换成代码

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