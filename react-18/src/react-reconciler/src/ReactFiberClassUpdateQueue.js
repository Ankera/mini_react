import { makeUpdateLaneFromFiberToRoot } from './ReactFiberCocurrentUpdates';

export function initialUpdateQueue (fiber) {
  const queue = {
    shared: {
      pending: null,
    },
  }

  fiber.updateQueue = queue;
}

export function createUpdate () {
  const update = {};

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