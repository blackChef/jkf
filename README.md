# Jkf
A javascript animation library that use css-keyframes-animation syntax. <a href="http://codepen.io/collection/AZMqqO/">examples</a>



## Keyframes
这是在 Jkf 里使用的 keyframes:

    {
        0: { left: 0, borderRadius: 0 },
        0.5: { left: '30px' },
        1: { left: '100px', borderRadius: '50%' }
    }

它是一个长得很像 css-keyframes 的 javascript object。值得注意的是:
 - 描述时间点的 key 是小数而不是百分数
 - 属性名是驼峰式的
 - 属性值为 0 时可以不加单位（百分号在这里被当作单位）



## Combinations
`transform: translateX(0) rotateZ(10deg) scale(1.2)`

transform 可以被当作由 translateX, rotateZ, scale 三个子属性组成。我们把像这样能拆分成多个子属性的属性叫做 combination。

combination 的子属性未必是要“真实”存在的。

`background-color: rgb(0, 0, 0)`

这里可以认为 background-color 是由 r, g, b 三个子属性组成。

Jkf 提供了 `Jkf.registerCombination` 方法，允许你自定义 combination。

因为 transform 被广泛应用，Jkf 预先把它注册成了 combination。你可以像这样在 keyframes 里使用 transform 了:

    {
      0: { translateX: 0, rotateZ: 0, borderRadius: 0, opacity: 1 },
      0.5: { borderRadius: '50%', opacity: 0.5 },
      1: { translateX: '100%', rotateZ: '360deg', borderRadius: 0, opacity: 1 }
    };

<a href="https://github.com/blackChef/jkf/blob/master/src/index.jsx#L24">Jkf 内部是如何注册 transform 的</a>

<a href="http://codepen.io/chef/pen/RWZeZx">如何把 background-color 注册成 combination</a>



## Usage

#### Jkf.update(elem, keyframes, progress)
给定 progress，把元素 style 成 keyframes 里相对应的状态。<a href="http://codepen.io/chef/pen/WQEgmJ">example</a>

 - elem ( type: dom ): 要操作的元素

 - keyframes ( type: object ): Jkf 使用的 keyframes rule

 - progress ( type: number ): 一个 0 ~ 1 之间的小数



#### Jkf.animate(elem, keyframes, duration [, options]) => controller
进行一段基于 keyframes 的动画。通过函数返回的 controller，可以对已经开始的动画进行控制。

 - elem ( type: dom ): 要操作的元素

 - keyframes ( type: object ): Jkf 使用的 keyframes rule

 - duration ( type: number ): 动画时间，以 ms 为单位

 - options ( type: object ) : 一个 javascript 对象，其中的所有项都是可选的

  - from ( type: number, default: 0 ): 设定动画的起始点

  - to ( type: number, default: 1 ): 设定动画的结束点。to 不需要大于 from，`{ from: 1, to: 0 }`
  是允许的。<a href="http://codepen.io/chef/pen/YyrYYP">example</a>

  - timingFunction ( type: array | string, default: 'ease' ): 支持数组形式的 cubic-bezier values，支持 linear，ease，ease-in，ease-out，ease-in-out 五种关键字

  - onUpdate ( type: function, params: [elem, progress] ): 动画每一次 update 时执行的 callback。elem 和当前的 progress 被传入函数。

  - onEnd ( type: function, params: [elem] ): 动画结束后执行的 callback。elem 被传入函数。<examplea href="http://codepen.io/chef/pen/YyrEYJ"></a>

 - controller ( type: object ): 可以对已经开始的动画进行控制。<a href="http://codepen.io/chef/pen/RWLwOX">example</a>

  - controller.pause(): 暂停

  - controller.resume(): 继续

  - controller.toggler(): 切换暂停或者继续



