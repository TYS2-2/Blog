

##### 2019-01-14
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