import React from './code/react';
import ReactDOM from './code/react-dom';

const element = (
  <div id="A">
    A1111
    <div id="B1">B1
      <div id="C1">C1</div>
      <div id="C2">C2</div>
    </div>
    <div id="B2">B2</div>
  </div>
)


ReactDOM.render(element, document.getElementById('root'));

