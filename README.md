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
