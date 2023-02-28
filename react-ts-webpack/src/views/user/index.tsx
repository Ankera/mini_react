import React from 'react';
import { useNavigate, NavLink, useParams, Outlet } from 'react-router-dom';

const User: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  return (
    <div>
      <NavLink to="/user/add" style={({ isActive }) => ({ color: isActive ? "red" : "blue" })}>
        添加用户
      </NavLink>
      <NavLink to="/user/list" style={({ isActive }) => ({ color: isActive ? "red" : "blue" })}>
        用户列表
      </NavLink>
      <button
        onClick={(): void => {
          navigate('/?type=1', { replace: true });
        }}
      >首页</button>
      <Outlet />
    </div>
  )
}

export default User;