import React from 'react';
import { BrowserRouter, Routes, Route, useRoutes  } from "react-router-dom";
import Layout from "./layout";
import routes from './routes';

const GlobalRoutes = () => useRoutes(routes)

const App = () => {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<div>hello</div>} />
        <Route path="/world" element={<div>world</div>} />
      </Routes>

      <Routes>
        <Route path="/2" element={<div>222</div>} />
        <Route path="/3" element={<div>333</div>} />
      </Routes>

      {/* <Layout routes={routes} /> */}

      

      {/* <GlobalRoutes /> */}
    </BrowserRouter>
  )
}

export default App;