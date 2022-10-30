import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Tree from './pages/tree';
import From from './pages/form';

const Layout: React.FC = () => {
  return (
    <div>Layout</div>
  )
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<From />} />

        <Route path="/tree" element={<Tree />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;