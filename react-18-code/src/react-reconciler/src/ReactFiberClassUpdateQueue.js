import { makeUpdateLaneFromFiberToRoot } from './ReactFiberCocurrentUpdates';
import assign from 'shared/assign';

export const UpdateState = 0;

export function initialUpdateQueue (fiber) {
  const queue = {
    shared: {
      pending: null,
    },
  }

  fiber.updateQueue = queue;
}

export function createUpdate () {
  const update = {
    tag: UpdateState
  };

  return update;
}

export function enqeueUpdate (fiber, update) {
  const updateQueue = fiber.updateQueue;
  const pending = updateQueue.shared.pending;
  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }

  updateQueue.shared.pending = update;

  // 返回根节点，从当前 fiber 节点一下到根节点
  return makeUpdateLaneFromFiberToRoot(fiber);
}

/**
 * 根据老状态和更新中的更新计算新状态
 * @param {*} workInPropress 
 */
export function processUpdateQueue (workInPropress) {
  const queue = workInPropress.updateQueue;
  const pendingQueue = queue.shared.pending;
  if (pendingQueue !== null) {
    // 清除等待生效的更新
    queue.shared.pending = null;

    // 获取更新队列中的最后一个
    const lastPendingUpdate = pendingQueue;

    // 指向第一个更新
    const firstPendingUpdate = lastPendingUpdate.next;

    // 把更新链表剪开，变成一个单列表
    lastPendingUpdate.next = null;

    let newState = workInPropress.memoizedState;
    let update = firstPendingUpdate;

    while (update) {
      newState = getStateFromUpdate(update, newState);
      update = update.next;
    }

    workInPropress.memoizedState = newState;
  }
}

function getStateFromUpdate (update, prevState) {
  switch (update.tag) {
    case UpdateState:
      const { payload } = update;
      return assign({}, prevState, payload);
    default:
      return null;
  }
}