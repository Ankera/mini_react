import React from 'react';
import { Routes, Route, Link, Router, useRoutes } from 'react-router-dom';
import routes from './router'

const GobalRoutes = () => useRoutes(routes);

function App() {
  return (
    <div>
      <h1>路由系统</h1>
      <div>
        <Link to="/">首页</Link>
        <Link to="/profile">个人中心</Link>
        <Link to="/user">用户</Link>
      </div>

      <GobalRoutes />
    </div>
  )
}

export default App;