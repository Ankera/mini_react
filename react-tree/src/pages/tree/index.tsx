import React from "react";
import { dataConfig } from "./data";
import { TreeData } from './interface';
import TreeNode from './treeNode';
import './index.less';

interface Props {

}

interface State {
  data: TreeData;
}

interface KeyNodeMap {
  [key: string]: TreeData;
}

class Tree extends React.Component<Props, State> {
  keyNodeMap: KeyNodeMap = {};

  constructor(props: Props) {
    super(props);
    this.state = { data: dataConfig };

    this.buildKeyMap();
  }

  componentDidMount(): void {

  }

  buildKeyMap = () => {
    const data = this.state.data;
    this.keyNodeMap = {};
    this.keyNodeMap[data.key] = data;
    if (data.children && data.children.length > 0) {
      this.walk(data.children, data);
    }
  }

  walk = (children: TreeData[], parent: TreeData): void => {
    const _this = this;
    children.forEach((item: TreeData) => {
      item.parent = parent;
      this.keyNodeMap[item.key] = item;
      if (item.children && item.children.length > 0) {
        _this.walk(item.children, item);
      }
    })
  }

  onCollapsed = (key: string) => {
    const data = this.keyNodeMap[key];
    const _this = this;
    if (data) {
      if (data.children && data.children.length > 0) {
        data.collapsed = !data.collapsed;
        data.children = data.children;
        this.setState({
          data: this.state.data
        })
      } else {
        data.loading = true;
        this.setState({
          data: this.state.data
        })
        setTimeout(() => {
          data.children = [
            {
              name: data.name + '的儿子1',
              key: data.key + '-1',
              type: 'folder',
              collapsed: true
            },
            {
              name: data.name + '的儿子2',
              key: data.key + '-2',
              type: 'folder',
              collapsed: true
            },
            {
              name: data.name + '的儿子3',
              key: data.key + '-3',
              type: 'file',
              collapsed: true
            }
          ];

          data.loading = false;
          data.collapsed = false;
          _this.setState({
            data: _this.state.data
          }, () => {
            _this.buildKeyMap();
          })
        }, 1500);
      }
    }
  }

  onCheck = (key: string) => {
    const data = this.keyNodeMap[key];
    if (data) {
      data.checked = !data.checked;

      if (data.checked) {
        this.checkChildren(data.children, true);
        this.checkParent(data.parent)
      } else {
        this.checkChildren(data.children, false);
        this.cancelParentCheck(data.parent)
      }

      this.setState({
        data: this.state.data
      })
    }
  }

  checkChildren = (children?: TreeData[], checked?: boolean) => {
    const _this = this;
    (children || []).forEach((item: TreeData) => {
      item.checked = checked;
      _this.checkChildren(item.children, checked);
    })
  }

  checkParent = (parent?: TreeData) => {
    while (parent) {
      parent.checked = (parent.children || []).every((item: TreeData) => item.checked)
      parent = parent.parent;
    }
  }

  cancelParentCheck = (parent?: TreeData) => {
    while (parent) {
      parent.checked = false;
      parent = parent.parent;
    }
  }

  render() {
    return (
      <div className="tree">
        <div className="tree-nodes">
          <TreeNode
            data={this.state.data}
            onCollapsed={this.onCollapsed}
            onCheck={this.onCheck}
          />
        </div>
      </div>
    )
  }
}

export default Tree;