import React from 'react';
import { Routes, Route, Link, Router, useRoutes, BrowserRouter } from 'react-router-dom';
import routes from './router';
import './App.less';
import {
  BrowerRouter as BrowerRouter2,
  Routes as Routes2,
  Route as Route2,
} from './react-router-dom';

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
      <BrowerRouter2>
        <Routes2>
          <Route2 path="/hello" element={(<div>hello</div>)} />
          <Route2 path="/world" element={(<div>world</div>)} />
        </Routes2>
      </BrowerRouter2>
    </div>
  )
}

export default App;