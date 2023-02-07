import logger, { indent } from "shared/logger";
import { HostRoot, HostComponent, HostText } from './ReactWorkTags';
import { processUpdateQueue } from './ReactFiberClassUpdateQueue';
import { mountChildFibers, reconcileChilFibers } from './ReactChildFiber';
import { shouldSetTextContent } from 'react-dom-bindings/src/client/ReactDOMHostConfig';

/**
 * 根据新的虚拟dom构建新的fiber子链表
 * @param {*} current 老fiber
 * @param {*} workInPropress 新fiber
 */
export function beginWork (current, workInPropress) {
  logger((" ").repeat(indent.number) + 'beginWork', workInPropress);
  indent.number += 2;

  switch (workInPropress.tag) {
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

  const nextState = workInPropress.memomizedState;
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