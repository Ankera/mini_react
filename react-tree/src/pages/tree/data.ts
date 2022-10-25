import { TreeData } from './interface';

export const dataConfig: TreeData = {
  name: "父亲",
  key: '1',
  type: 'folder',
  collapsed: false,
  children: [
    {
      name: '儿子1',
      key: '1-1',
      type: 'folder',
      collapsed: false,
      children: [
        {
          name: '孙子1',
          key: '1-1-1',
          type: 'folder',
          collapsed: false,
          children: [
            {
              name: '重孙1',
              key: '1-1-1-1',
              type: 'file',
              collapsed: false,
              children: [],
            },
            {
              name: '重孙2',
              key: '1-1-1-2',
              type: 'file',
              collapsed: false,
              children: [],
            },
            {
              name: '重孙3',
              key: '1-1-1-3',
              type: 'file',
              collapsed: false,
              children: [],
            }
          ]
        }
      ]
    },
    {
      name: '儿子2',
      key: '1-2',
      type: 'folder',
      collapsed: true
    }
  ]
}