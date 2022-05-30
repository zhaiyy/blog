function baz () {
  // 当前调用栈是：baz
  // 因此，当前调用位置是全局作用域
  var name = 'baz'
  console.log('baz', this.name)
  bar() // ＜-- bar的调用位置
}

function bar () {
  // 当前调用栈是baz—＞ bar
  // 因此，当前调用位置在baz中
  var name = 'bar'
  console.log('bar', this.name)
  foo() // ＜-- foo的调用位置
}

function foo () {
  // 当前调用栈是baz -＞bar -＞ foo
  // 因此，当前调用位置在bar中
  var name = 'foo'
  console.log('foo', this.name)
}

var name = 'window'
baz() // ＜--baz的调用位置
