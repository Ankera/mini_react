import React from "react";
import {
  CaretDownOutlined,
  FileTextOutlined,
  CaretRightOutlined,
  FolderOutlined,
  FolderOpenOutlined
} from '@ant-design/icons';
import { TreeData } from './interface';
import './index.less';

interface Props {
  data: TreeData;
  onCollapsed: any;
  onCheck: any;
}

class TreeNode extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const { data: { name, children, key, collapsed, type, checked = false } } = this.props;
    let caret: React.ReactNode = null;
    let icon: React.ReactNode = null;

    if (type === 'folder') {
      icon = collapsed ? <FolderOutlined /> : <FolderOpenOutlined />;

      if (collapsed) {
        caret = (
          <span onClick={(): void => {
            this.props.onCollapsed(key)
          }}>
            <CaretRightOutlined />
          </span>
        )
      } else {
        caret = (
          <span onClick={(): void => {
            this.props.onCollapsed(key)
          }}>
            <CaretDownOutlined />
          </span>
        )
      }
    } else {
      icon = <FileTextOutlined />;
    }

    return (
      <div className="tree-node">
        <div className="inner">
          <span className="content">
            {caret}
            <input
              type="checkbox"
              checked={checked}
              onChange={() => {
                this.props.onCheck(key)
              }}
            />
            {icon}
            {name}
          </span>
        </div>
        {
          children && children.length > 0 && !collapsed && (
            <div className="children">
              {
                children.map((item: TreeData) => (
                  <TreeNode
                    data={item}
                    key={item.key}
                    onCollapsed={this.props.onCollapsed}
                    onCheck={this.props.onCheck}
                  />
                ))
              }
            </div>
          )
        }
      </div>
    )
  }
}

export default TreeNode;