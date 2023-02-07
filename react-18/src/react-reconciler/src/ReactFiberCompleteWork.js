import logger, { indent } from "shared/logger";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import {
  createTextInstance,
  createInstance,
  appendInitialChild,
  finalizeInitialChildren
} from 'react-dom-bindings/src/client/ReactDOMHostConfig';
import { NoFlags } from "./ReactFiberFlags";

/**
 * 完成一个fiber节点
 * @param {*} current 
 * @param {*} workInPropress 
 */
export function completeWork (current, workInPropress) {
  indent.number -= 2;
  logger((" ").repeat(indent.number) + 'completeWork', workInPropress);

  const newProps = workInPropress.pendingProps;

  switch (workInPropress.tag) {
    case HostText:
      // 创建 或 挂载新节点
      const newText = newProps;
      workInPropress.stateNode = createTextInstance(newText);

      // 向上冒泡属性, 收集副作用
      bubbleProperties(workInPropress);
      break;
    case HostComponent:
      const { type } = workInPropress;
      const instance = createInstance(type, newProps, workInPropress);

      appendAllChildren(instance, workInPropress);

      // 把所有子节点挂载到父节点上
      workInPropress.stateNode = instance;

      finalizeInitialChildren(instance, type, newProps);

      // 向上冒泡属性, 收集副作用
      bubbleProperties(workInPropress);
      break;
    case HostRoot:
      bubbleProperties(workInPropress);
      break;
    default:
      break;
  }
}

function bubbleProperties (completedWork) {
  let subtreeFlags = NoFlags;
  let child = completedWork.child;

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;

    child = child.sibling;
  }

  completedWork.subtreeFlags = subtreeFlags;
}

/**
 * 课时66
 * 把当前完成的 fiber 所有子节点对应的真实 DOM 都挂载到自己父节点parent真实DOM节点上
 * @param {*} parent 父节点真实DOM
 * @param {*} workInPropress 完成的fiber
 */
function appendAllChildren (parent, workInPropress) {
  let node = workInPropress.child;

  while (node) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      node = node.child;
      continue;
    }

    if (node === workInPropress) {
      return;
    }

    // 如果当前的节点没有弟弟
    while (node.sibling === null) {
      if (node.return === null || node.return === workInPropress) {
        return;
      }
      // 回到父节点
      node = node.return;
    }

    node = node.sibling;
  }
}