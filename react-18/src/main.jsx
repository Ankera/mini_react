import * as React from 'react';
import { createRoot } from 'react-dom/client'

// /**
//  * FiberRoot 一个真实的 DOM 节点
//  * RootFiber fiber 的根节点
//  */

// let element = (
//   <h1 id="container">
//     hello <span style={{ color: 'red' }}>world</span>
//   </h1>
// )

// function FunctionComponentClick () {
//   return (
//     <h1
//       id="container"
//       onClick={() => {
//         console.log('父冒泡');
//       }}
//       onClickCapture={(event) => {
//         console.log('父捕获');
//         // event.stopPropagation();
//       }}
//     >
//       hello
//       <span
//         style={{ color: 'red' }}
//         onClick={() => {
//           console.log('子冒泡');
//         }}
//         onClickCapture={() => {
//           console.log('子捕获');
//         }}
//       > Function</span>
//     </h1>
//   )
// }

// const elementClick = <FunctionComponentClick />


const counter = (state, action) => {
  if (action.type === 'add') {
    return state + 1;
  }
  return state;
}

function FunctionComponentReducer () {

  // debugger;
  const [number, setNumber] = React.useReducer(counter, 0);

  return (
    <button
      onClick={() => {
        // debugger;
        setNumber({ type: 'add' });
      }}
    >
      {number}
    </button>
  )
}

const elementReducer = <FunctionComponentReducer />

const root = createRoot(document.getElementById('root'));

root.render(elementReducer);