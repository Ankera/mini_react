import React, { useRef, useState, useLayoutEffect } from 'react';
import { createBrowserHistory, createHashHistory } from 'history';
import { Router, Routes, Route } from '../react-router';

export {
  Routes,
  Route
}

export const HashRouter = ({ children }: any) => {
  let historyRef = useRef<any>(null);

  if (historyRef.current === null) {
    historyRef.current = createHashHistory();
  }

  const history: any = historyRef.current;

  const [state, setState] = useState({
    action: history.action,
    location: history.location
  })

  useLayoutEffect(() => {
    // 监听路径变化事件，如果当地址栏中路径发生变化，会重新执行 setState 组件会重新渲染
    history.listen(setState)
  }, [history])

  return (
    <Router
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  )
}

export const BrowerRouter = ({ children }: any) => {
  let historyRef = useRef<any>(null);

  if (historyRef.current === null) {
    historyRef.current = createBrowserHistory();
  }

  const history: any = historyRef.current;
  const [state, setState] = useState({
    action: history.action,
    location: history.location
  })

  useLayoutEffect(() => {
    // 监听路径变化事件，如果当地址栏中路径发生变化，会重新执行 setState 组件会重新渲染
    history.listen(setState);
  }, [history])

  return (
    <Router
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  )
}