import { HostRoot } from './ReactWorkTags';

const concurrentQueue = [];
let concurrentQueueIndex = 0;

/**
 * 此节点要处理更新优先级的问题
 * 1、向上找到根节点
 * 2、
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

/**
 * 把更新队列添加到更新的队列中
 * @param {*} fiber 函数组件对应的fiber
 * @param {*} queue 
 * @param {*} update 
 */
export function enqueueConcurrentHookUpdate (fiber, queue, update) {
  enqueueUpdate(fiber, queue, update);
  return getRootFiberUpdatedFiber(fiber);
}

function getRootFiberUpdatedFiber (sourceFiber) {
  let node = sourceFiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }

  return node.tag === HostRoot ? node.stateNode : null;
}

/**
 * 把更新先缓存到数组中
 * @param {*} fiber 
 * @param {*} queue 
 * @param {*} update 
 */
function enqueueUpdate (fiber, queue, update) {
  concurrentQueue[concurrentQueueIndex++] = fiber;
  concurrentQueue[concurrentQueueIndex++] = queue;
  concurrentQueue[concurrentQueueIndex++] = update;
}

export function finishQueueingConcurrentUpdates () {
  const endIndex = concurrentQueueIndex;
  concurrentQueueIndex = 0;
  let i = 0;
  while (i < endIndex) {
    const fiber = concurrentQueue[i++];
    const queue = concurrentQueue[i++];
    const update = concurrentQueue[i++];
    if (queue !== null && update !== null) {
      const pending = queue.pending;
      if (pending === null) {
        update.next = update;
      } else {
        update.next = pending.next;
        pending.next = update;
      }
      queue.pending = update;
    }
  }
}