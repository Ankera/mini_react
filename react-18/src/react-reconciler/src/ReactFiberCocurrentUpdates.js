import { HostRoot } from './ReactWorkTags';

/**
 * 此节点要处理更新优先级的问题
 * 1、向上找到根节点
 * @param {*} sourceFiber 
 */
export function makeUpdateLaneFromFiberToRoot (sourceFiber) {
  let node = sourceFiber;
  let parent = sourceFiber.return;
  while (parent !== null) {
    node = parent;
    parent = parent.return;
  }

  if (node.tag === HostRoot) {
    return node.stateNode;
  }
  return null;
}