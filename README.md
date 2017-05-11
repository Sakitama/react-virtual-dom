# react-virtual-dom

## 简介

一个简单的React.js virtual dom算法的实现

## 使用方法

1. `npm install`安装所以依赖
2. 在`./src/js/main.js`编辑代码：
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
3. 使用`npm start`运行webpack打包，打开`test/test.html`查看结果。

## 算法介绍

主要分为四步：
1. 使用`el`方法用js对象结构代表一棵DOM树，称为js树。
2. 使用`render`方法用js树生成真正的DOM树插入到文档中。
3. 如果新生成了一棵js树，使用`diff`方法比较旧树和新树之间的差别，找到需要给旧树“打补丁”的地方。
4. 使用`patch`方法根据第三步得到的“补丁”去更新第二步中生成的DOM树。
