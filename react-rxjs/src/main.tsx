import React from 'react'
import ReactDOM from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}


/**
 * 函数就是 pull
 * 
 *              生产者                消费者
 * pull 被动：在请求时生产数据        主动：决定何时请求数据
 * push 主动：以自己的速度生产数据     被动：对收到的数据做出反应
 */