import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Breadcrumb } from 'antd';
import { fetchAPI38465Data } from '@/server/index';
import MainMenu from '@/components/menu';
const { Header, Content, Footer, Sider } = Layout;

const Home = () => {


  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (c: boolean) => {
    setCollapsed(c);
  };


  useEffect(() => {
    fetchAPI38465Data().then((data) => {
      console.log('data', data);
    })
  }, [])


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div className="logo" />

        <MainMenu />
      </Sider>

      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ paddingLeft: '16px' }}>
          <Breadcrumb style={{ lineHeight: '64px' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content style={{ margin: '16px 16px 0' }} className="site-layout-background">
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center', padding: 0, lineHeight: '48px' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
}

export default Home;