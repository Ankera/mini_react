import logger, { indent } from "shared/logger";
import { HostRoot, HostComponent, HostText } from './ReactWorkTags';
import { FunctionComponent, IndeterminateComponent } from './ReactWorkTags';
import { processUpdateQueue } from './ReactFiberClassUpdateQueue';
import { mountChildFibers, reconcileChilFibers } from './ReactChildFiber';
import { shouldSetTextContent } from 'react-dom-bindings/src/client/ReactDOMHostConfig';
import { renderWithHooks } from "./ReactFiberHooks";

/**
 * 根据新的虚拟dom构建新的fiber子链表
 * @param {*} current 老fiber
 * @param {*} workInPropress 新fiber
 */
export function beginWork (current, workInPropress) {
  logger((" ").repeat(indent.number) + 'beginWork', workInPropress);
  indent.number += 2;

  switch (workInPropress.tag) {
    case IndeterminateComponent:
      return mountIndeterminateComponent(current, workInPropress, workInPropress.type);
    case FunctionComponent: {
      const Component = workInPropress.type;
      const props = workInPropress.pendingProps;
      return updateFunctionComponent(current, workInPropress, Component, props);
    }
    case HostRoot:
      return updateHostRoot(current, workInPropress);
    case HostComponent:
      return updateHostComponent(current, workInPropress);
    case HostText:
      return null;
    default:
      return null;
  }
}

function updateHostRoot (current, workInPropress) {
  processUpdateQueue(workInPropress);

  const nextState = workInPropress.memoizedState;
  const nextChilren = nextState.element;

  reconcileChilren(current, workInPropress, nextChilren);
  return workInPropress.child;
}

function updateHostComponent (current, workInPropress) {
  const { type } = workInPropress;
  const nextProps = workInPropress.pendingProps;
  let nextChilren = nextProps.children;

  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChilren = null;
  }

  reconcileChilren(current, workInPropress, nextChilren);
  return workInPropress.child;
}

/**
 * 根据新的虚拟DOM生成新的fiber
 * @param {*} current 老的 fiber
 * @param {*} workInPropress 新的 fiber
 * @param {*} nextChilren 新的子虚拟 DOM
 */
function reconcileChilren (current, workInPropress, nextChilren) {
  if (current === null) {
    workInPropress.child = mountChildFibers(workInPropress, null, nextChilren);
  } else {
    workInPropress.child = reconcileChilFibers(workInPropress, current.child, nextChilren)
  }
}

/**
 * 挂载函数组件
 * @param {*} current 老的 fiber
 * @param {*} workInPropress 新的 fiber
 * @param {*} Component 组件类型
 */
export function mountIndeterminateComponent (current, workInPropress, Component) {
  const props = workInPropress.pendingProps;

  // const value = Component(props);
  const value = renderWithHooks(current, workInPropress, Component, props);

  workInPropress.tag = FunctionComponent;

  reconcileChilren(current, workInPropress, value);

  return workInPropress.child;
}

/**
 * 
 * @param {*} current 
 * @param {*} workInPropress 
 * @param {*} Component 
 * @param {*} nextProps 
 */
export function updateFunctionComponent (current, workInPropress, Component, nextProps) {
  const nextChildren = renderWithHooks(current, workInPropress, Component, nextProps);

  reconcileChilren(current, workInPropress, nextChildren);

  return workInPropress.child;
}