import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { KeepAliveProvider, withKeepAlive } from './keep-alive';
import Tree from './pages/tree';
import From from './pages/form';
import Dragger from './pages/drag';
import RouterApp from './pages/routers/app';
import Home from './pages/routers/home';
import List from './pages/routers/list';
import Details from './pages/routers/details';
import './app.less';

const KeepAliveList = withKeepAlive(List, { cacheId: 'List' });
const KeepAliveDetails = withKeepAlive(Details, { cacheId: 'Details' });

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <KeepAliveProvider>
        <Routes>
          <Route path="/" element={<RouterApp />}>
            <Route index element={<Home />} />
            <Route path="list" element={<KeepAliveList />} />
            <Route path="details" element={<KeepAliveDetails />} />
            <Route path="tree" element={<Tree />} />
            <Route path="form" element={<From />} />
            <Route path="drag" element={<Dragger />} />
            <Route path="keep-alive" element={<h1>keep-alive</h1>} />
          </Route>
        </Routes>
      </KeepAliveProvider>
    </BrowserRouter>
  )
}

export default App;