
import React from 'react';
import ReactDOM from 'react-dom/client';
import Counter from './counter';
import { NoMode } from './ReactTypeOfMode';
import { HostRoot } from './ReactWorkTags';
// import React from './code/react';
// import ReactDOM from './code/react-dom';

// https://blog.csdn.net/zgaoq/article/details/125999758

// ReactDOM.render(<Counter />, document.getElementById('root'));

const counterInstance = new Counter();
const mode = NoMode;

const rootFiber = {
  tag: HostRoot,
  updateQueue: [],
  mode,
}


ReactDOM.createRoot(document.getElementById('root')).render(<Counter />)
