import logger from "shared/logger";
import { HostRoot, HostComponent, HostText } from './ReactWorkTags';

/**
 * 根据新的虚拟dom构建新的fiber子链表
 * @param {*} current 老fiber
 * @param {*} workInPropress 新fiber
 */
export function beginWork (current, workInPropress) {
  logger('beginWork', workInPropress);

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
  // processUpdateQueue(workInPropress);

  const nextState = workInPropress.memomizedState;
  const nextChilren = workInPropress.element;

  return null
}

function updateHostComponent (current, workInPropress) {

}