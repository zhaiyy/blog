《你不知道JavaScript》 ---this
=========================
 <div style="text-align: right">  2021/7/2 </div>


 # 为什么要用this
this提供了一种更优雅的方式来隐式“传递”一个对象引用，因此可以将API设计得更加简洁并且易于复用。
```js
function identify () {
  return this.name.toUpperCase()
}

function speak () {
  var greeting = "Hello, I'm " + identify.call(this)
  console.log(greeting)
}

var me = {
  name: 'Kyle'
}

var you = {
  name: 'Reader'
}

identify.call(me) // KYLE
identify.call(you) // READER
speak.call(me) // Hello,我是KYLE
speak.call(you) // Hello,我是READER

```
这段代码可以在不同的上下文对象（me和you）中重复使用函数identify()和speak()，不用针对每个对象编写不同版本的函数

# 对 this 的误解
## 指向自身？
```js
function foo (num) {
  console.log('foo:' + num)
  // 记录foo被调用的次数
  this.count++
}
foo.count = 0
var i
for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i)
  }
}
// foo:6
// foo:7
// foo:8
// foo:9
// foo被调用了多少次？
console.log(foo.count) // 0—什么？
```
foo(..)确实被调用了4次，但是foo.count仍然是0。执行foo.count = 0时，的确向函数对象foo添加了一个属性count。但是函数内部代码this.count中的this并不是指向那个函数对象.
使用 call 修改this 指针调用
```js
function foo (num) {
  console.log('foo:' + num)
  // 记录foo被调用的次数
  this.count++
}

foo.count = 0

var i

for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo.call(foo, i)
  }
}
// foo:6
// foo:7
// foo:8
// foo:9
// foo被调用了多少次？
console.log(foo.count) // 4
```

## this指向函数的作用域?
```js
function foo () {
    var a = 2;
    bar();
}
function bar () {
    console.log(this.a) // undefined
}
foo();
```
上面代码试图使用this联通foo()和bar()的词法作用域，从而让bar()可以访问foo()作用域里的变量a， 这是不可能实现的。

# this全部解析
this实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。
## 1、默认绑定
最常用的函数调用类型：独立函数调用。可以把这条规则看作是无法应用下面其他3种规则时的默认规则。
```js
function foo () {
  console.log(this.a) // 2
  console.log(this.b) // undefined
}
var a = 2
const b = 'global b'
foo();
```
函数调用时应用了this的默认绑定，因此this指向全局对象 window.a
let、const声明的全局变量不会挂在顶层对象下面

## 2、隐式绑定
### 当函数引用有上下文对象时，隐式绑定规则会把函数调用中的this绑定到这个上下文对象
```js
function foo () {
  console.log(this.a)
}
const obj = {
  a: 2,
  foo: foo
}
obj.foo() // 2
```
### 对象属性引用链中只有上一层或者说最后一层在调用位置中起作用
```js
function foo () {
  console.log(this.a)
}
const obj2 = {
  a: 42,
  foo: foo
}
const obj1 = {
  a: 2,
  obj2: obj2
}
obj1.obj2.foo() // 42
```
### 隐式丢失
```js
function foo () {
  console.log(this.a) // global
}
const obj = {
  a: 2,
  foo: foo
}
var bar = obj.foo
var a = 'global'
bar()
```
bar是obj.foo的一个引用,它引用的是foo函数本身，因此此时的bar()其实是一个不带任何修饰的函数调用.
## 3、显式绑定
### call && apply
```js
function foo () {
  console.log(this.a)
}
const obj = {
  a: 2
}
foo.call(obj) // 2
foo.apply(obj) // 2
```
call && apply 调用foo时强制把它的this绑定到obj上
call && apply  并不能解决隐式丢失的问题
### bind
```js
function foo () {
  console.log(this.a)
}
const obj = {
  a: 2
}
var bar = foo.bind(obj)
bar() // 2
```
bind(..)会返回一个硬编码的新函数，它会把你指定的参数设置为this的上下文并调用原始函数。
## 4、new绑定
```js
function foo (a) {
  this.a = a
}
var bar =  new foo(2)
console.log(bar.a) // 2
```

使用new来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

1．创建（或者说构造）一个全新的对象。

2．这个新对象会被执行[[Prototype]]连接。

3．这个新对象会绑定到函数调用的this。

4．如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。

# 优先级

了函数调用中this绑定的四条规则，你需要做的就是找到函数的调用位置并判断应当应用哪条规则。

默认绑定的优先级是四条规则中最低的，所以我们可以先不考虑它。

## 隐式绑定和显式绑定哪个优先级更高？

```js
function foo () {
  console.log(this.a)
}
const obj1 = {
  a: 2,
  foo:foo
}
const obj2 = {
  a: 3,
  foo:foo
}
obj1.foo() // 2
obj2.foo() // 3
obj1.foo.call(obj2) // 3
obj2.foo.call(obj1) // 2
```

显式绑定优先级更高，也就是说在判断时应当先考虑是否可以存在显式绑定。

## new绑定和隐式绑定的优先级

```js
function foo (someting) {
  this.a = someting
}
const obj1 = {
  foo:foo
}
const obj2 = {}

obj1.foo(2)
console.log(obj1.a) // 2

obj1.foo.call(obj2, 3)
console.log(obj2.a) //3 

var bar = new obj1.foo(4)
console.log(obj1.a) // 2
console.log(bar.a) // 4
```

可以看到new绑定比隐式绑定优先级高

## 判断this

1．函数是否在new中调用（new绑定）？如果是的话this绑定的是新创建的对象。
2．函数是否通过call、apply（显式绑定）或者硬绑定调用？如果是的话，this绑定的是指定的对象。
3．函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this绑定的是那个上下文对象。
4．如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到undefined，否则绑定到全局对象。

# 绑定例外

1、如果你把null或者undefined作为this的绑定对象传入call、apply或者bind，这些值在调用时会被忽略，实际应用的是默认绑定规则
2、创建一个函数的“间接引用”，在这种情况下，调用这个函数会应用默认绑定规则。
3、如果可以给默认绑定指定一个全局对象和undefined以外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改this的能力。