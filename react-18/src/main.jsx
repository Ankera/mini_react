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


// ============================== useState, key 不同，type相同 ==============================
function FunctionComponentState2 () {
  const [number, setNumber] = React.useState(0);

  return number === 0 ? (
    <div
      key="title1"
      id="titlel1"
      onClick={() => {
        setNumber(number + 1);
      }}
    >
      title1
    </div>
  ) : (
    <div
      key="title2"
      id="titlel2"
      onClick={() => {
        // setNumber(number + 1);
      }}
    >
      title2
    </div>
  )
}


// ============================== useState, key 同，type不相同 ==============================
function FunctionComponentState3 () {
  const [number, setNumber] = React.useState(0);

  return number === 0 ? (
    <div
      key="title1"
      id="titlel1"
      onClick={() => {
        setNumber(number + 1);
      }}
    >
      title1
    </div>
  ) : (
    <p
      key="title1"
      id="titlel2"
      onClick={() => {
        setNumber(number + 1);
      }}
    >
      title2
    </p>
  )
}

function FunctionComponentState4 () {
  const [number, setNumber] = React.useState(0);

  return number === 0 ? (
    <ul
      key="container"
      onClick={() => {
        setNumber(number + 1);
      }}
    >
      <li key="A" id="A">A</li>
      <li key="B" id="B">B</li>
      <li key="C" id="C">C</li>
    </ul>
  ) : (
    <ul
      key="container"
      onClick={() => {
        setNumber(number + 1);
      }}
    >
      <li key="A" id="A">A</li>
    </ul>
  )
}


// ============================== useState, 删除 ==============================
function FunctionComponentState5 () {
  const [number, setNumber] = React.useState(0);

  return number === 0 ? (
    <ul
      key="container"
      onClick={() => {
        setNumber(number + 1);
      }}
    >
      <li key="A" id="A">A</li>
      <li key="B" id="B">B</li>
      <li key="C" id="C">C</li>
    </ul>
  ) : (
    <ul
      key="container"
      onClick={() => {
        setNumber(number + 1);
      }}
    >
      <li key="A" id="A2">A2</li>
      <p key="B" id="B">B</p>
      <li key="C" id="C2">C2</li>
      <li key="D" id="D">D</li>
    </ul>
  )
}

function FunctionComponentState6 () {
  const [number, setNumber] = React.useState(0);

  return number === 0 ? (
    <ul
      key="container"
      onClick={() => {
        setNumber(number + 1);
      }}
    >
      <li key="A">A</li>
      <li key="B" id="B">B</li>
      <li key="C" >C</li>
      <li key="D" >D</li>
      <li key="E" >E</li>
      <li key="F" id="F">F</li>
    </ul>
  ) : (
    <ul
      key="container"
      onClick={() => {
        setNumber(number + 1);
      }}
    >
      <li key="A">A2</li>
      <li key="C" >C2</li>
      <li key="E" >E2</li>
      <li key="B" id="B2">B2</li>
      <li key="G" >G</li>
      <li key="D" id="D">D2</li>
    </ul>
  )
}

// ============================== useEffect ==============================
function FunctionComponentEffect () {

  const [number, setNumber] = React.useState(0);

  React.useEffect(() => {
    console.log('number1', number);
    return () => {
      console.log('number1 destroy', number);
    }
  }, []);

  React.useEffect(() => {
    console.log('number2', number);
    return () => {
      console.log('number2 destroy', number);
    }
  }, [number]);

  return (
    <button
      onClick={() => {
        setNumber(number + 1);
      }}
    >
      {number}
    </button>
  )
}

const element = <FunctionComponentEffect />

const root = createRoot(document.getElementById('root'));

root.render(element);