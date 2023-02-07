const NoLanes = 0b00;

const NoLane = 0b00;

const SyncLane = 0b01;

const InputContinuousHydrationLane = 0b10;

/**
 * 
 * @param {*} set 本次要更新的
 * @param {*} subSet 当前的更新的
 * @returns 
 */
function isSubsetOfLanes (set, subSet) {
  return (set & subSet) === subSet;
}

function mergeLanes (a, b) {
  return a | b;
}

function initializeUpdateQueue (fiber) {
  const queue = {
    baseState: fiber.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
    },
  }

  fiber.updateQueue = queue;
}

function enqueueUpdate (fiber, update) {
  const updateQueue = fiber.updateQueue;
  const sharedQueue = updateQueue.shared;
  const pending = sharedQueue.pending;
  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }

  sharedQueue.pending = update;
}

function getStateFromUpdate (update, prevState) {
  return update.payload(prevState);
}

function processUpdateQueue (fiber, renderLanes) {
  const queue = fiber.updateQueue;
  // 老链表头
  let firstBaseUpdate = queue.firstBaseUpdate;
  // 老链表尾
  let lastBaseUpdate = queue.lastBaseUpdate;
  // 新链表尾
  const pendingQueue = queue.shared.pending;

  // 合并新老链表
  if (pendingQueue !== null) {
    queue.shared.pending = null;
    // 新链表尾
    const lastPendingUpdate = pendingQueue;
    // 新链表头
    const firstPendingUpdate = lastPendingUpdate.next;
    // 把老链表间断，变成单链表
    lastPendingUpdate.next = null;
    if (lastBaseUpdate === null) {
      firstBaseUpdate = firstPendingUpdate;
    } else {
      lastBaseUpdate.next = firstPendingUpdate;
    }
    lastBaseUpdate = lastPendingUpdate;
  }

  if (firstBaseUpdate !== null) {
    let newState = queue.baseState;
    let newLanes = NoLanes;
    let newBaseState = null;
    let newFirstBaseUpdate = null;
    let newLastBaseUpdate = null;
    let update = firstBaseUpdate;
    do {
      const updateLane = update.lane;
      // 如果updateLane 不是 renderLanes
      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        const clone = {
          id: update.id,
          lane: updateLane,
          payload: update.payload
        }
        if (newLastBaseUpdate === null) {
          newFirstBaseUpdate = newLastBaseUpdate = clone;
          newBaseState = newState;
        } else {
          newLastBaseUpdate = newLastBaseUpdate.next = clone;
        }

        newLanes = mergeLanes(newLanes, updateLane);
      } else {
        if (newLastBaseUpdate !== null) {
          const clone = {
            id: update.id,
            lane: updateLane,
            payload: update.payload
          }

          newLastBaseUpdate = newLastBaseUpdate.next = clone;
        }

        newState = getStateFromUpdate(update, newState);
      }

      update = update.next;
    } while (update);

    if (!newLastBaseUpdate) {
      newBaseState = newState;
    }

    // 跳过的状态
    queue.baseState = newBaseState;
    queue.firstBaseUpdate = newFirstBaseUpdate;
    queue.lastBaseUpdate = newLastBaseUpdate;
    fiber.lanes = newLanes;
    // 计算新的状态
    fiber.memoizedState = newState;
  }
}

function printUpdateQueue (updateQueue) {
  const { baseState, firstBaseUpdate } = updateQueue;
  let desc = baseState + '#';
  let update = firstBaseUpdate;
  while (update) {
    desc += (update.id) + " => ";
    update = update.next;
  }
  desc += 'null';

  console.log('desc: ', desc);
}

let fiber = { memoizedState: '' };

initializeUpdateQueue(fiber);

// debugger;

const updateA = { id: "A", payload: state => state + "A", lane: SyncLane };
enqueueUpdate(fiber, updateA);

const updateB = { id: "B", payload: state => state + "B", lane: InputContinuousHydrationLane };
enqueueUpdate(fiber, updateB);

const updateC = { id: "C", payload: state => state + "C", lane: SyncLane };
enqueueUpdate(fiber, updateC);

const updateD = { id: "D", payload: state => state + "D", lane: SyncLane };
enqueueUpdate(fiber, updateD);

processUpdateQueue(fiber, SyncLane);

console.log('fiber', fiber, fiber.memoizedState);

printUpdateQueue(fiber.updateQueue);

//================================================================

// const updateE = { id: "E", payload: state => state + "E", lane: InputContinuousHydrationLane };
// enqueueUpdate(fiber, updateE);


// const updateF = { id: "F", payload: state => state + "F", lane: SyncLane };
// enqueueUpdate(fiber, updateF);

// processUpdateQueue(fiber, InputContinuousHydrationLane);

// console.log('fiber', fiber.memoizedState);

/**
 * 23 || 5
 */