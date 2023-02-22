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
  if (['add1', 'add2', 'add3'].includes(action.type)) {
    return state + 1;
  }
  return state;
}

function FunctionComponentReducer () {

  const [number, setNumber] = React.useReducer(counter, 11);
  const [number1, setNumber1] = React.useReducer(counter, 22);
  const [number2, setNumber2] = React.useReducer(counter, 33);
  const [number3, setNumber3] = React.useReducer(counter, 44);

  return (
    <button
      onClick={() => {
        debugger;
        setNumber({ type: 'add1' });
        // setNumber({ type: 'add2' });
        // setNumber({ type: 'add3' });
      }}
    >
      {number}
    </button>
  )
}

// ============================== useState ==============================
function FunctionComponentState () {
  console.log('Function')
  const [number, setNumber] = React.useState(0);

  return (
    <button
      onClick={() => {
        setNumber(number);
        setNumber(number + 1);
        setNumber(number + 2);
      }}
    >
      {number}
    </button>
  )
}

const element = <FunctionComponentState />

const root = createRoot(document.getElementById('root'));

root.render(element);