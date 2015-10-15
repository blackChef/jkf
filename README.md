# Jkf
A javascript animation library that use css-keyframes-animation syntax.

<a href="http://codepen.io/collection/AZMqqO/">demos</a>


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

因为 transform 被广泛应用，Jkf 预先把它注册成了 combination。你可以像这样在 keyframes 里使用 transform 了：

    {
      0: { translateX: 0, rotateZ: 0, borderRadius: 0, opacity: 1 },
      0.5: { borderRadius: '50%', opacity: 0.5 },
      1: { translateX: '100%', rotateZ: '360deg', borderRadius: 0, opacity: 1 }
    };




## Usage

### Jkf.update(elem, keyframes, progress)
Description: 给定 progress，把元素 style 成 keyframes 里相对应的状态。<a href="http://codepen.io/chef/pen/WQEgmJ">demo</a>

 - elem: dom 元素
 - keyframes: Jkf 使用的 keyframes rule
 - progress: 一个 0 ~ 1 之间的小数



### Jkf.animate

### Jkf.utils

