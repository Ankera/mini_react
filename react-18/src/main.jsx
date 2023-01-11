import { createRoot } from './react-dom/client'

let element = (
  <h1>
    hello <span style={{ color: 'red' }}>world</span>
  </h1>
)

// debugger
const root = createRoot(document.getElementById('root'));

console.log('element', root);

root.render(element);

/**
4 9 12 16 22 28 / 11 

4 8 12 15 22 29 / 7
 */