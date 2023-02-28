import React from 'react';
import { Routes, Route, Link, Router, useRoutes, BrowserRouter } from 'react-router-dom';
import routes from './router';
import './App.less';

const GobalRoutes = () => useRoutes(routes);

function App() {
  return (
    <div>
      <h1>官方路由</h1>
      <BrowserRouter>
        <div>
          <Link to="/">首页</Link>
          <Link to="/profile">个人中心</Link>
          <Link to="/user/add">用户</Link>
        </div>
        <GobalRoutes />
      </BrowserRouter>


      <hr />
      <h1>自己路由</h1>

    </div>
  )
}

export default App;