import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Tree from './pages/tree';


interface HomeProps {
  title: string;
}

const Layout: React.FC = () => {
  return (
    <div>Layout</div>
  )
}

const Home: React.FC<HomeProps> = (props) => {
  const { title } = props;
  return (
    <div>{title}</div>
  )
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tree />}>
          <Route index element={<Home title="Home - index" />} />
        </Route>

        <Route path="/tree" element={<Tree />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;