import React from 'react';
import { BrowserRouter, Routes, Link, useRoutes  } from "react-router-dom";
import routes from '../routes';
import "./index.less";

interface LayoutProps {
  routes: any;
}

const GlobalRoutes = () => useRoutes(routes)

const Layout:React.FC<LayoutProps> = (props) => {

  return (
    <div className="layout">
      <div className="layout-left">
        {
          props.routes.map((item: any, index: number) => (
            <div key={index}>
              <Link to={item.path}>{item.title}</Link>
            </div>
          ))
        }
      </div>
      <div className="layout-right">
          <GlobalRoutes />
      </div>
    </div>
  )
}

export default Layout;