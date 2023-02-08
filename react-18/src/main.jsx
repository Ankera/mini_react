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

function FunctionComponent () {
  return (
    <h1
      id="container"
      onClick={() => {
        console.log('父冒泡');
      }}
      onClickCapture={(event) => {
        console.log('父捕获');
        event.stopPropagation();
      }}
    >
      hello
      <span
        style={{ color: 'red' }}
        onClick={() => {
          console.log('子冒泡');
        }}
        onClickCapture={() => {
          console.log('子捕获');
        }}
      > Function</span>
    </h1>
  )
}

// debugger
const root = createRoot(document.getElementById('root'));

// console.log('element', root);

const element2 = <FunctionComponent />
// console.log('element2', element2);

root.render(element2);