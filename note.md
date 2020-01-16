
##### 2020-01-16
### js继承方式有哪些：原型链继承、构造函数继承、组合继承、原型式继承、寄生组合继承
#### 原型链继承
```
function Parent() {
  this.nameArr = []
  this.name = ''
}
Parent.prototype.getName = function() {
  return {
    nameArr: this.nameArr,
    name: this.name
  }
}
Parent.prototype.saveName = function(name) {
  this.nameArr.push(name)
  this.name = name
}
function Child() {

}
Child.prototype = new Parnet()
let child1 = new Child()
child1.saveName('name1')
child1.getName() // {nameArr: ['name1'], name: 'name1'}

let child2 = new Child()
child2.saveName('name2')
child2.getName() // {nameArr: ['name1', 'name2'], name: 'name2'}   //nameArr 数据被缓存下来了

```
##### 将子方法的原型指向父方法，从而实现继承关系
##### 缺点：当父方法内有引用类型的属性时，该属性会在子方法里面共享数据


#### 构造继承（借用构造函数继承）
```
function Parent() {
  this.nameArr = []
}
function Child() {
  Parent.call(this)
}

let child1 = new Child()
child1.nameArr.push('name1')//['name1']

let child2 = new Child()
child2.nameArr.push('name2')//['name2']
```
##### 在子方法内部通过cal改变Parent的this的指向，指向为当前实例出来的方法，从而实现继承的关系
##### 优点：父方法内部即使存在引用类型的属性，也不会出现数据共享的现象
##### 缺点：每次实例化的时候都会调用父方法

#### 组合继承
```
function Parent(name) {
  this.nameArr = []
  this.name = name
}
Parent.prototype.getName = function() {
  return {
    nameArr: this.nameArr,
    name: this.name
  }
}
Parent.prototype.saveName = function(name) {
  this.nameArr.push(name)
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

Child.prototype = new Parent()//将Child的prototype指向父构造函数

let child1 = new Child('name1', 10)
child1.saveName('name1')
child1.getName()//{nameArr: ['name1'], name: 'name1'}

let child2 = new Child('name2', 20)
child2.getName()//{nameArr: ['name2'], name: 'name2'}
```
##### 通过借用构造函数和调整prototype的指向两中方式，组合起来实现继承
##### 这种方法集合了原型继承和构造继承的优点，但是在重新指向prototype和借用构造方法时会重复调用父构造方法
#### 组合继承优化
##### 优化的目的：减少父构造方法的调用，减少不必要的属性
```
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function prototype(child, parent) {
  var prototype = object(parent.prototype);
  prototype.constructor = child;
  child.prototype = prototype;
}

prototype(Child, Parent);
```
##### 优点：只调用了一次 Parent 构造函数


##### 2020-01-14
### vue中watch和computed的区别
##### watch：监听变量的变化，做出相应的逻辑处理，可以影响一个或多个变量，是一对多的关系
##### computed：多个变量通过逻辑处理计算得到一个新的变量，并且会见结果缓存，当依赖的变量更新时才更新结果，是多队一的关系

### 防抖和节流的区别
##### 防抖：最后一次触发事件结束一定时间之后，再执行回调方法，如果再一定时间段内重复触发，则清除上一次的定时器重新计时
```
function debounce(fn, wait) {
  let timeout = null; // 创建一个标记用来存放定时器的返回值，因为闭包的原因，timeout变量会一直存在不会被销毁
  return function () {
    clearTimeout(timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
    timeout = setTimeout(() => { // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
      fn.apply(this, arguments);
    }, wait);
  };
}
```
##### 节流：在事件触发的一段时间内，只执行一次回调方法，在这段时间之后才会继续执行回调
```
function throttle(fn, wait) {
  let canRun = true; // 通过闭包保存一个标记
  return function () {
    if (!canRun) return; // 在函数开头判断标记是否为true，不为true则return
    canRun = false; // 立即设置为false
    setTimeout(() => { // 将外部传入的函数的执行放在setTimeout中
      fn.apply(this, arguments);
      // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是false，在开头被return掉
      canRun = true;
    }, wait);
  };
}
```