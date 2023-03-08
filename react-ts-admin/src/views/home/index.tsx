import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Breadcrumb } from 'antd';
import { fetchAPI38465Data, fetchAPI38472Data } from '@/server/index';
import MainMenu from '@/components/menu';
import styles from './index.module.scss';
const { Header, Content, Footer, Sider } = Layout;

const Home = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [menus, setMenus] = useState([]);
  const [menusIndex, setMenusIndex] = useState(0);

  const [route, setRoute] = useState<any>({})

  const [secondLevel, setSecondLevel] = useState([]);

  const onCollapse = (c: boolean) => {
    setCollapsed(c);
  };


  useEffect(() => {
    fetchAPI38465Data().then((data:any) => {
      setMenus(data.list);
      getTwoStageRoutes(data.list[0].cloudCategoryId)
    })
  }, [])

  const getTwoStageRoutes = async (id: string):Promise<void> => {
    const res: any = await fetchAPI38472Data({
      cloudCategoryId: id
    });
    setSecondLevel(res.list);
  }

  const appendScript = (src: string) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = () => {
      const key = 'ElectronicDoor';
      setRoute({component: (window as any)[key]})
    }
    document.body.appendChild(script);
  }

  const loadingJavascript = (item: any, x:number) => {
    const url = '/broadcast/electronicDoor';
    const src = (window as any).pageUmd[url];
    appendScript(src);

    if(x === 0){
      navigate('/a');
    } else if(x === 1){
      navigate('/b');
    } else if(x === 2){
      navigate('/c');
    } else if(x === 3){
      navigate('/d');
    } else {
      navigate(item.url)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerLeft}>
        {
          menus.map((item: any, x:number) => (
            <div 
              key={item.cloudCategoryId}
              className={`${styles.menusItem} ${menusIndex === x ? styles.menusItemActive : ''}`}
              aria-hidden
              onClick={() => {getTwoStageRoutes(item.cloudCategoryId)}}
            >
              {item.cloudCategoryName.slice(0,3)}
            </div>
          ))
        }
      </div>
      <div className={styles.containerRight}>
        <div className={styles.crLeft}>
          {
            secondLevel.map((item: any, x:number) => (
              <div 
                key={item.moduleId}
                className={styles.crLeftItem}
              >
                <div className={styles.crLeftTitle}>{item.moduleName}</div>
                {
                  Array.isArray(item.menuResourceList) && item.menuResourceList.map((elt: any, y:number) => (
                    <div 
                      key={elt.url}
                      className={styles.crLeftInnerItem}
                      aria-hidden
                      onClick={() => loadingJavascript(elt, y)}
                    >
                      {elt.name}
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
        <div className={styles.crRight}>
          {
            (route && route.component) ? <route.component  state={{ permissions:[] }} />: <div>loading</div>
          }

          <hr />

          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Home;