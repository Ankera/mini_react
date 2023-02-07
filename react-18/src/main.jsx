import { createRoot } from './react-dom/client'

/**
 * FiberRoot 一个真实的 DOM 节点
 * RootFiber fiber 的根节点
 */

let element = (
  <h1 id="container">
    hello <span style={{ color: 'red' }}>world</span>
  </h1>
)

// debugger
const root = createRoot(document.getElementById('root'));

// console.log('element', root);

root.render(element);