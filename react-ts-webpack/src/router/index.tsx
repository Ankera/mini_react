
import React from 'react';
import Profile from '../views/profile';
import User from '../views/user';
import Home from '../views/home';
import UserAdd from '../views/user/userAdd';
import UserList from '../views/user/userList';

const routes = [
  {
    path: '/',
    name: '首页',
    element: <Home />
  },
  {
    path: '/profile',
    name: '个人中心',
    element: <Profile />
  },
  {
    path: '/user',
    name: '用户',
    element: <User />,
    children: [
      {
        path: 'add',
        element: <UserAdd />
      },
      {
        path: 'list',
        element: <UserList />
      }
    ]
  }
]

export default routes;