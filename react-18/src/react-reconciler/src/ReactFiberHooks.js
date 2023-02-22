import ReactSharedInternals from "shared/ReactSharedInternals";
import { scheduledUpdateOnFiber } from "./ReactFiberWorkLoop";
import { enqueueConcurrentHookUpdate } from './ReactFiberCocurrentUpdates';

const { ReactCurrentDispatcher } = ReactSharedInternals;

// 当前正在使用的hook
let workInPropressHook = null;
// 当前正在渲染中的fiber
let currentlyRenderingFiber = null;
// 当前hook对应的老hook
let currentHook = null;

const HooksDispatcherOnMount = {
  useReducer: mountReducer,
  useState: mountState,
}

const HooksDispatcherOnUpdate = {
  useReducer: updateReducer,
  useState: updateState,
}

function mountState (initalState) {
  const hook = mountWorkInProgressHook();
  hook.memoizedState = initalState;

  const queue = {
    pending: null,
    dispatch: null,
    // 上一个 reducer
    lastRederedReducer: baseStateReducer,
    // 上一个 state
    lastRederedState: initalState
  }

  hook.queue = queue;
  const dispatch = (queue.dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue));

  return [hook.memoizedState, dispatch];
}

/**
 * 派发新状态
 */
function dispatchSetState (fiber, queue, action) {
  const update = {
    action,
    next: null,
    // 是否有急切的更新
    hasEagerState: false,
    // 急切的更新状态
    eagerState: null,
  }

  // 当派发新动作后，我立刻用上一次的状态和上一次reducer计算新状态
  const { lastRederedReducer, lastRederedState } = queue;
  const eagerState = lastRederedReducer(lastRederedState, action);
  update.hasEagerState = true;
  update.eagerState = eagerState;

  if (Object.is(eagerState, lastRederedState)) {
    return;
  }

  const root = enqueueConcurrentHookUpdate(fiber, queue, update);

  scheduledUpdateOnFiber(root);
}

function baseStateReducer (state, action) {
  return typeof action === 'function' ? action(state) : action;
}

function updateState () {
  return updateReducer(baseStateReducer);
}

function updateReducer (reducer) {
  // 获取新的hook
  const hook = updateWorkInProgressHook();

  const queue = hook.queue;
  const current = currentHook;

  const pendingQueue = queue.pending;
  let newState = current.memoizedState;
  if (pendingQueue !== null) {
    queue.pending = null;
    const firstUpdate = pendingQueue.next;
    let update = firstUpdate;
    do {
      if (update.hasEagerState) {
        newState = update.eagerState;
      } else {
        const action = update.action;
        newState = reducer(newState, action);
      }

      update = update.next;
    } while (update !== null && update !== firstUpdate)
  }

  hook.memoizedState = newState;
  return [hook.memoizedState, queue.dispatch];
}

function updateWorkInProgressHook () {
  if (currentHook === null) {
    const current = currentlyRenderingFiber.alternate;
    currentHook = current.memoizedState;
  } else {
    currentHook = currentHook.next;
  }

  const newHook = {
    memoizedState: currentHook.memoizedState,
    queue: currentHook.queue,
    next: null
  }
  if (workInPropressHook === null) {
    currentlyRenderingFiber.memoizedState = workInPropressHook = newHook;
  } else {
    workInPropressHook = workInPropressHook.next = newHook;
  }

  return workInPropressHook;
}


function mountReducer (reducer, initialArg) {
  const hook = mountWorkInProgressHook();
  hook.memoizedState = initialArg;

  const queue = {
    pending: null,
    dispatch: null,
  }

  hook.queue = queue;

  const dispatch = (queue.dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber, queue));

  return [hook.memoizedState, dispatch];
}

/**
 * 执行派发动作的方法，更新方法，更新状态，绘制页面
 * @param {*} fiber 
 * @param {*} queue 
 * @param {*} action 
 */
function dispatchReducerAction (fiber, queue, action) {
  // 在每个hook里面存放一个更新队列，循环链表
  const update = {
    action,
    next: null
  }

  // 入队并发的hook更新
  // 把当前最新的更新添加到更新队列中，并且返回当前的根fiber
  const root = enqueueConcurrentHookUpdate(fiber, queue, update);

  scheduledUpdateOnFiber(root);
}

/**
 * 挂载构建中的hook
 */
function mountWorkInProgressHook () {
  const hook = {
    memoizedState: null, // hook的状态
    queue: null, // hook 更新队列
    next: null, // 指向下一个hook
  }

  if (workInPropressHook === null) {
    currentlyRenderingFiber.memoizedState = workInPropressHook = hook;
  } else {
    workInPropressHook = workInPropressHook.next = hook;
  }

  return workInPropressHook;
}

/**
 * 
 * @param {*} current 
 * @param {*} workInPropress 
 * @param {*} Component 
 * @param {*} props 
 */
export function renderWithHooks (current, workInPropress, Component, props) {
  currentlyRenderingFiber = workInPropress;

  if (current !== null && current.memoizedState !== null) {
    ReactCurrentDispatcher.current = HooksDispatcherOnUpdate;
  } else {
    ReactCurrentDispatcher.current = HooksDispatcherOnMount;
  }

  // 函数组件执行前，给hooks赋值  
  const children = Component(props);

  workInPropressHook = null;

  currentlyRenderingFiber = null;

  currentHook = null;

  return children;
}