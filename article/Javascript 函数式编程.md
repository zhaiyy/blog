Javascript 函数式编程
=================
 <div style="text-align: right">  2018/10/26 </div>

# 定义

函数式编程（英语：functional programming）或称函数程序设计，又称泛函编程，是一种[编程典范](https://zh.wikipedia.org/wiki/%E7%B7%A8%E7%A8%8B%E5%85%B8%E7%AF%84)，它将计算机运算视为[数学](https://zh.wikipedia.org/wiki/%E6%95%B8%E5%AD%B8)上的[函数](https://zh.wikipedia.org/wiki/%E5%87%BD%E6%95%B0_(%E6%95%B0%E5%AD%A6))计算，并且避免使用[程序状态](https://zh.wikipedia.org/w/index.php?title=%E7%A8%8B%E5%BA%8F%E7%8A%B6%E6%80%81&action=edit&redlink=1)以及[易变对象](https://zh.wikipedia.org/wiki/%E4%B8%8D%E5%8F%AF%E8%AE%8A%E7%89%A9%E4%BB%B6)。

## 什么是数学函数 

初中数学中定义

设在一个变化过程中有两个变量x与y,如果对于x的每一个值,y都有唯一的值与它对应,那么就说x是自变量,y是x的函数.


![](https://user-gold-cdn.xitu.io/2018/10/26/166afb9946cb1318?w=440&h=288&f=jpeg&s=23914) 
第一个图片每一个x 对应唯一一个y 值，此为函数
![](https://user-gold-cdn.xitu.io/2018/10/26/166afb9be8ea4d36?w=380&h=244&f=jpeg&s=25069)
第二张图片x=5对应 多个y的值，所以此不为函数

举例来说，现在有这样一个数学表达式： `(1 + 2) \* 3 - 4`

传统的过程式编程，可能这样写： 

```javascript
 var a = 1 + 2;
 var b = a \* 3;
 var c = b - 4;
```

 函数式编程要求使用函数，我们可以把运算过程定义为不同的函数，然后写成下面这样： 

`var result = subtract(multiply(add(1,2), 3), 4);`

# 函数风格的编程特点

    1. 纯函数，没有副作用

    2. 引用透明

    3. 不修改状态 

    4. 声明式与命令式

    5. 函数是第一等公民


## 1. 纯函数，没有副作用

在Javascript中对于数组的操作，有些是纯的，有些就不是纯的。 

[下面来举个栗子：](https://tool.lu/coderunner/?id=5bi)

```javascript
var arr = [1,2,3,4,5];
 arr.slice(0,3); //=\> [1,2,3]
 arr.slice(0,3); //=\> [1,2,3]
 ```

Array.slice是纯函数，因为它没有副作用，对于固定的输入，输出总是固定的

```javascript
var arr = [1,2,3,4,5];
 arr.splice(0,3); //=\> [1,2,3]
 arr.splice(0,3); //=\> [4,5] 
 arr.splice(0,3); //=\> [] 
```

Array.splice是不纯的，它有副作用，对于固定的输入，输出不是固定的

函数式编程强调没有“副作用”，意味着函数要保持独立，所有功能就是返回一个新的值，没有其他行为，尤其是不得修改外部变量的值，即一个函数调用 n 次后依然返回同样的结果。

```javascript
var a = 1;
 // 含有副作用，它修改了外部变量 a， 多次调用结果不一样
 function test1() {
  a++
  return a;
 }
 // 无副作用，没有修改外部状态， 多次调用结果一样
 function test2(a) {
  return a + 1;
 }
```

## 2. 引用透明

指一个函数只会用到传递给它的变量以及自己内部创建的变量，不会使用到其他变量。

```javascript
 var a = 1;
 var b = 2;
 // 函数内部使用的变量并不属于它的作用域
 function test1() {
 return a + b;
 }
 // 函数内部使用的变量是显式传递进去的
 function test2(a, b) {
 return a + b;
 }
```

## 3. 不修改状态

在其他类型的语言中，变量往往用来保存"状态"。而函数式编程只是返回新的值，不修改系统变量，即是无破坏性的数据转换。
```javascript
//修改状态

function addElement(y) {
 var x = [1, 2];
 x.push(y)
 console.log(x)
 return x;
 }
 addElement(3) // x-\>[1,2,3]

//不修改状态

function addElement(y) {
 var x = [1, 2];
 var z = x.slice(0);
 z.push(y)
 console.log(x)
 return z;
 }
 addElement(3)
```

## 4. 声明式与命令式

    • 命令式：程序花费大量代码来描述用来达成期望结果的特定步骤，即"How to do"

    • 声明式：程序抽象了控制流过程，花费大量代码描述的是数据流，即"What to do"

**以做蔬菜沙拉举例**

    * 声明式: 蔬菜.做成菜(蔬菜沙拉)

    * 命令式: 洗干净(蔬菜)
            混合(蔬菜, 沙拉) 
            放入盘中(混合物)

举一些栗子🌰：

希望得到一个数组每个数据平方后的和
```javascript
// 命令式
 function mysteryFn (nums) {
  let squares = []
  let sum = 0 // 1\. 创建中间变量
  for (let i = 0; i \< nums.length; i++) {
  squares.push(nums[i] \* nums[i]) // 2\. 循环计算平方
  }
  for (let i = 0; i \< squares.length; i++) {
  sum += squares[i] // 3\. 循环累加
  }
  return sum
 }
 // 以上代码都是 how 而不是 what…
```

```javascript
// 声明式
 const mysteryFn = (nums) =\> sumFn(squaresFn(nums))
 function squaresFn(ary) {
  let squares = []
  for (let i = 0; i \< ary.length; i++) {
  squares.push(ary[i] \* ary[i])
  }
  return squares
 }
 function sumFn(ary) {
  let sum = 0
  for (let i = 0; i \< ary.length; i++) {
  sum += ary[i]
  }
  return sum
 }
```

## 5. 函数是第一等公民 

所谓”第一等公民”（first class），指的是函数与其他数据类型一样，处于平等地位，可以赋值给其他变量，也可以作为参数，传入另一个函数，或者作为别的函数的返回值。

下面这些术语都是围绕这一特性的应用：

### 闭包

函数内定义了局部变量并且返回可缓存的函数. 变量在返回的函数内也是可被访问的, 此处创建了一个闭包
```javascript
// test1 是普通函数
 function test1() {
  var a = 1;
  // test2 是内部函数
  // 它引用了 test1 作用域中的变量 a
  // 因此它是一个闭包
  return function test2() {
  return a + 1;
  }
 }
```
### 函数组合 (Composition)

前面提到过，函数式编程的一个特点是通过串联函数来求值。然而，随着串联函数数量的增多，代码的可读性就会不断下降。函数组合就是用来解决这个问题的方法。
```javascript
var compose = function(f,g) {
  return function(x) {
  return f(g(x));
  };
 };
```
这就是 组合（compose，以下将称之为组合），f 和 g 都是函数，x 是在它们之间通过“管道”传输的值。

组合看起来像是在饲养函数。你就是饲养员，选择两个有特点又遭你喜欢的函数，让它们结合，产下一个崭新的函数。

组合的用法如下：
```javascript
var toUpperCase = function (x) {
  return x.toUpperCase();
 };
 var exclaim = function (x) {
  return x + '!';
 };
 var shout = compose(exclaim, toUpperCase);

 shout("send in the clowns");
 //=\> "SEND IN THE CLOWNS!”
```
### 柯里化 (Currying)

柯里化是对函数的封装，当调用函数时传递参数数量不足时，会返回一个新的函数，直到参数数量足够时才进行求值。
```javascript
var add = function (x) {
  return function (y) {
  return x + y;
  };
 };
 var increment = add(1);
 var addTen = add(10);
 increment(2);// 3
 addTen(2);// 12
```
这里我们定义了一个 add 函数，它接受一个参数并返回一个新的函数。调用 add 之后，返回的函数就通过闭包的方式记住了 add 的第一个参数。

调用lodash curry 的🌰
```javascript
var curry = require('lodash').curry;

 function sum(x,y,z) {
  return x+y+z;
 }
 var sumCurry = curry(sum);
 sumCurry(1,2,3) == sumCurry(1,2)(3) == sumCurry(1)(2,3) == sumCurry(1)(2)(3) == 6
```
### 模式匹配 (Pattern matching)

模式匹配是指可以为一个函数定义多个版本，通过传入不同参数来调用对应的函数。形式上有点像「方法重载」，但方法重载是通过传入参数类型不同来区分的，模式匹配没有这个限制。利用模式匹配，我们可以去掉函数中的「分支」(最常见的是 if)，写出非常简洁的代码。
```javascript
// 普通版本，需要在函数内部对参数进行判断
 function fib(x) {
  if (x === 0) return 0;
  if (x === 1) return 1;
  return fib(x-1) + fib(x-2);
 }
```
```javascript
// 模式匹配版本。

// 由于 JavaScript 不支持模式匹配，

// 下面代码只是作演示用途

var fib = (0) =\> 0;

var fib = (1) =\> 1;

var fib = (x) =\> fib(x-1) + fib(x-2);
// 调用

fib(10);
```

简单来说，pattern 就像是数学中的分段函数。通过使用 pattern matching，就可以对不同的参数定义不同的函数体。当调用函数的时候，可以通过对比实参和形参的模式就可以选择正确的函数体。

### 高阶函数 (Higher order function)

如果一个函数接受函数作为参数，或者返回值为函数，那么该函数就是高阶函数。

数组中常用到的高阶函数
```javascript
 Array.prototype.map()
 Array.prototype.reduce()
 Array.prototype.filter()
 Array.prototype.sort()
 Array.prototype.find()
```

最后我们来看看一个混合使用这些函数的例子：

假设我要从 http://example.com?type=1&keyword=hello&test= 中提取查询字符串，过滤掉无效键值对，最后返回一个 Object 形式的结果，大概会有以下步骤：

    1. http://example.com?type=1&keyword=hello&test-\>

    2. type=1&keyword=hello&test -\>

    3. [ 'type=1', 'keyword=hello', 'test' ] -\>

    4. [ [ 'type', '1' ], [ 'keyword', 'hello' ], ['test'] ] -\>

    5. [ [ 'type', '1' ], [ 'keyword', 'hello' ] ] -\>

    6. { type: 1, keyword: 'hello’ }

使用js的常用的数组以及字符串的函数实现
```javascript
url
 .split('?')[1]
 .split('&')
 .map(v =\> v.split('='))
 .filter(v =\> v.length === 2)
 .reduce((prev, next) =\>
 Object.assign(prev, { [next[0]]: next[1] }),
 {});
```
# 函数式编程的优点 

总结一下，函数式编程具有以下四个优点：

1. 代码简洁，开发快速

函数式编程大量使用函数，减少了代码的重复，因此程序比较短，开发速度较快。

2. 接近自然语言，易于理解

比如之前这样的表达式`(1 + 2) \* 3 - 4`，写成函数式语言

`var result = subtract(multiply(add(1,2), 3), 4);`

对它进行变形，可以得到另一种写法：

`var result = add(1,2). Multiply(3). Subtract(4);`

3. 更方便的代码管理

函数式编程不依赖、也不会改变外界的状态，只要给定输入参数，返回的结果必定相同。因此，每一个函数都可以被看做独立单元，很有利于进行单元测试（unit testing）和除错（debugging），以及模块化组合。
4. 易于"并发编程"

函数式编程不需要考虑"死锁"（deadlock），因为它不修改变量，所以根本不存在"锁"线程的问题。不必担心一个线程的数据，被另一个线程修改，所以可以很放心地把工作分摊到多个线程，部署"并发编程"（concurrency）。

以上是自己对函数式编程的一点拙见，请小哥哥小姐姐指正