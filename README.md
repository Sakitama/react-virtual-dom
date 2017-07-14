# react-virtual-dom

## 简介

一个简单的React.js virtual dom算法的实现

## 使用方法

1. `npm install`安装所有依赖
2. 在`./src/js/main.js`编辑代码，样例如下：
```javascript
import el from './element';
import diff from './diff';
import patch from './patch';

let count = 0;
// 1. use `el(tagName, [propeties], children)` to create a virtual dom tree
let ul = el('ul', {id: 'list'}, [
    el('li', {class: 'item'}, [count]),
    el('li', {class: 'item'}, [count + 1]),
    el('li', {class: 'item'}, [count + 2])
]);

// 2. generate a real dom from virtual dom. `root` is a `div` element
let dom = ul.render();

document.body.appendChild(dom);

setInterval(() => {
    count++;
	// 3. generate another different virtual dom tree
    let newUl = el('ul', {id: 'list'}, [
        el('li', {class: 'item'}, [count]),
        el('li', {class: 'item'}, [count + 1]),
        el('li', {class: 'item'}, [count + 2])
    ]);
	// 4. diff two virtual dom trees and get patches
    let patches = diff(ul, newUl);
    ul = newUl;
	// 5. apply patches to real dom
    patch(dom, patches);
}, 2000);
```
3. 使用`npm start`运行webpack打包，打开`test/test.html`查看结果

## 算法介绍

主要分为四步：
1. 使用`el`方法用js对象结构代表一棵DOM树，称为js树
2. 使用`render`方法用js树生成真正的DOM树插入到文档中
3. 如果新生成了一棵js树，使用`diff`方法比较旧树和新树之间的差别，找到需要给旧树使用的“补丁”
4. 使用`patch`方法根据第三步得到的“补丁”去更新第二步中生成的DOM树

## diff 算法
React 中最值得称道的部分莫过于 Virtual DOM 模型与 diff 的完美结合，特别是其高效的 diff 算法，可以让用户无需顾忌性能问题而“任性自由”地刷新页面，让开发者也可以无需关心 Virtual DOM 背后的运作原理。因为 diff 会帮助我们计算出 Virtual DOM 中真正变化的部分，并只针对该部分进行原生 DOM 操作，而非重新渲染整个页面，从而保证了每次操作更新后页面的高效渲染。

### 传统的 diff 算法
计算一棵树形结构转换为另一棵树形结构的最少操作，是一个复杂且值得研究的问题。传统 diff 算法通过循环递归对节点进行依次比较，算法复杂度达到 O(n<sup>3</sup>)，太高了，对于前端渲染场景来说不可接受。

### React 的 diff 算法的策略
1. 策略1：Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。
2. 策略2：拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
3. 策略3：对于同一层级的一组子节点，它们可以通过唯一 id 进行区分，也就是 key。

#### 策略1（tree diff）
基于策略1，对树进行分层比较，两棵树只会对同一层次的节点进行比较，即同一个父节点下的所有子节点。当发现节点已经不存在时，则该节点及其子节点会被完全删除掉，不会用于进一步的比较。这样只需对树进行一次遍历，便能完成整个 DOM 树的比较。也就是说，只会简单地考虑同层级节点的位置变换，而对于不同层级的节点，只有创建和删除操作。
如果出现节点跨层级移动的情况，并不会出现移动操作，而是会执行删除和创建操作。这是一种影响 React 性能的操作，因此官方建议不要进行 DOM 节点跨层级的操作。
在开发组件时，保持稳定的 DOM 结构会有助于性能的提升。例如，可以通过 CSS 隐藏或显示节点，而不是真正地移除或添加 DOM 节点。

#### 策略2（component diff）
React 是基于组件构建应用的，对于组件间的比较所采取的策略也是非常简洁、高效的。
1. 如果是同一类型的组件，按照原策略继续比较 Virtual DOM 树即可。
2. 如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点。
3. 对于同一类型的组件，有可能其 Virtual DOM 没有任何变化，如果能够确切知道这点，那么就可以节省大量的 diff 运算时间。因此，React 允许用户通过 shouldComponentUpdate() 来判断该组件是否需要进行 diff 算法分析。
极端情况：新旧两个组件的子结构一样，但是由于新旧两个组件的类型不同，diff 不会“花心思”去比较两者的结构，而是直接删除旧组件，替换为新组件。这种情况比较少见，这也是策略2的由来，不同的类型的组件很少存在相似的树形结构。

#### 策略3（element diff）
同一层级的结点添加唯一的 key 就是为了提高性能。