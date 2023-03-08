import React from "react";
import { Button } from 'antd';
import { Outlet, useNavigate, Link } from 'react-router-dom';

const Page1 = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>首页23</h1>
      <Button onClick={() => {
        navigate('/')
      }}>+</Button>

      <ul>
        <li>
          <Link to="/login">登录页面111</Link>
        </li>
        <li>
          <Link to="/standLone">独立页面22</Link>
        </li>
      </ul>
    

    </div>
  )
}

export default Page1;