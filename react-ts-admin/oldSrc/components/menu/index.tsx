import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'page1',
    key: '/page1',
  },
  {
    label: 'page2',
    key: '/page2',
  },
  {
    label: 'page3',
    key: '/page3',
  }
];

const MainMenu = () => {
  const navigate = useNavigate();

  const [openKeys, setOpenKeys] = useState(['/page3']);

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys([keys[keys.length - 1]]);
  }

  return (
    <Menu
      theme="dark"
      items={items}
      defaultSelectedKeys={['/page1']}
      mode="inline"
      onClick={(e: any) => {
        navigate(e.key)
      }}
      onOpenChange={handleOpenChange}
      openKeys={openKeys}
    />
  )
}

export default MainMenu;