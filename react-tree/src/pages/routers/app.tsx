import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './common.less';

const RouterApp: React.FC = (): JSX.Element => {
  return (
    <div>
      <Link to="/">首页</Link>
      <Link to="/list">列表</Link>
      <Link to="/details">详情</Link>
      <Link to="/tree">树形</Link>
      <Link to="/form">表单</Link>
      <Link to="/drag">拖拽</Link>
      <Link to="/keep-alive">keep-alive</Link>

      <Outlet />
    </div>
  )
}

export default RouterApp;