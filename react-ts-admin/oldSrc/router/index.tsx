import React from 'react';
import { Navigate } from 'react-router-dom';
import Home from '@/views/home';
import Page1 from '@/views/page1';
import Page2 from '@/views/page2';

const withLoadingComponent = (comp: any) => (
  <React.Suspense fallback={<div>loading...</div>}>
    {comp}
  </React.Suspense>
)

const routes = [
  {
    path: '/home',
    element: <div>hello home</div>
  },
  {
    path: "/",
    element: <Navigate to="/page1" />
  },
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/page1",
        element: withLoadingComponent(<Page1 />)
      },
      {
        path: "/page2",
        element: withLoadingComponent(<Page2 />)
      }
    ]
  },
  {
    path: "*",
    element: <div>404</div>
  }
];

export default routes;