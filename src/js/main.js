import el from './element';
import diff from './diff';
import patch from './patch';

let count = 0;
let ul = el('ul', {id: 'list'}, [
    el('li', {class: 'item'}, [count]),
    el('li', {class: 'item'}, [count + 1]),
    el('li', {class: 'item'}, [count + 2])
]);

let dom = ul.render();

document.body.appendChild(dom);

setInterval(() => {
    count++;
    let newUl = el('ul', {id: 'list'}, [
        el('li', {class: 'item'}, [count]),
        el('li', {class: 'item'}, [count + 1]),
        el('li', {class: 'item'}, [count + 2])
    ]);
    let patches = diff(ul, newUl);
    ul = newUl;
    patch(dom, patches);
}, 2000);