import React from "react";

const NavigationContenxt = React.createContext({});
const LocationContenxt = React.createContext({});

export function Route(props: any) { return null }

export const Router = ({ children, location, navigator }: any) => {
  const navigationContext = { navigator }
  return (
    <NavigationContenxt.Provider value={navigationContext}>
      <LocationContenxt.Provider value={{ location }}>
        {children}
      </LocationContenxt.Provider>
    </NavigationContenxt.Provider>
  )
}

export const Routes = ({ children }: any) => {
  return useRoutes(createRoutesFromChildren(children))
}

function useLocation() {
  return (React.useContext(LocationContenxt) as any).location;
}

function useRoutes(routes: any) {
  // 获取当前的路径
  let location = useLocation();
  let pathname = location.pathname;
  for (let i = 0; i < routes.length; i++) {
    const { path, element } = routes[i];
    const match = matchPath(path, pathname);
    if (match) {
      return element;
    }
  }
}

function matchPath(path: any, pathname: any) {
  const matcher = compilePath(path);
  return pathname.match(matcher);
}

function compilePath(path: any) {
  return new RegExp("^" + path + "$");
}

function createRoutesFromChildren(children: any) {
  const routes: any = [];
  React.Children.forEach(children, element => {
    routes.push({
      path: element.props.path,
      element: element.props.element,
    });
  });
  return routes;
}