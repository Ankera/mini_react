import React from 'react'
import ReactDOM from 'react-dom/client';
import * as antd from 'antd';
import * as icons from '@ant-design/icons'
import { BrowserRouter } from 'react-router-dom';
import 'reset-css';
import '@/assets/styles/global.scss';
import App from './App';

const win = window as any;
win.React = React;
win.antd = antd;
win.icons = icons;
win.ReactDOM = ReactDOM;

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
}

