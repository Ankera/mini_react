import { useRoutes, Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/views/Home';
import Page1 from '@/views/Page1';
import Page2 from '@/views/Page2';

const withLoadingComponent = (comp: any) => (
  <React.Suspense fallback={<div>loading...</div>}>
    {comp}
  </React.Suspense>
)

export default () => {

  return (
    <Routes>
      <Route path="/" element={<div>首页1</div>} /> 
      <Route path="/login" element={<div>登录</div>} /> 
      <Route path="/standLone" element={<div>单页面</div>} /> 
      <Route path="/" element={withLoadingComponent(<Home />)}>
        <Route path="a" element={withLoadingComponent(<Page1 />)} /> 
        <Route path="b" element={withLoadingComponent(<Page2 />)} /> 
        <Route path="c" element={<div>ccccccc3c</div>} /> 
        <Route path="d" element={<Navigate to="/a" />} /> 
        <Route path="e" element={<div>eeeeeee</div>} /> 
        <Route path="*" element={<div>首页404</div>} /> 
      </Route> 
      <Route path="*" element={<div>505</div>} /> 
    </Routes>
  )
}
