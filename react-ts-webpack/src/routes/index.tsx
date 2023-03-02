import React from 'react';

const routes = [
  {
    title: '首页',
    path: '/',
    isStandalone: true,
    element: <div>首页</div>
  },
  {
    title: '登录',
    path: '/login',
    isStandalone: true,
    element: <div>登录</div>
  },
  {
    title: '测试11',
    path: '/1',
    element: <div>1111</div>
  },
  {
    title: '测试2',
    path: '/2',
    element: <div>2222</div>
  },
  {
    title: '测试33',
    path: '/3',
    element: <div>3333</div>
  },
  {
    title: '测试44',
    path: '/4',
    element: <div>4444</div>
  },
  {
    title: '测试55',
    path: '/5',
    element: <div>5555</div>
  },
  {
    path: '*',
    element: <div>*****</div>
  }
]

export default routes;