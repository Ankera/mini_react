import {
  IdlePriority,
  ImmediatePriority,
  LowPriority,
  UserBlockingPriority,
  NormalPriority
} from "./SchedulerPriorities";
import { push, peek, pop } from './SchedulerMinHeap';

// 
const maxSigned31BitInt = 1073741823;

// 立刻过期
const IMMEDIATE_PRIORITY_TIMEOUT = -1;

// Eventually times out
const USER_BLOCKING_PRIORITY_TIMEOUT = 250;

// 正常优先级的过期时间 5秒
const NORMAL_PRIORITY_TIMEOUT = 5000;

// 低优先级的过期时间 10秒
const LOW_PRIORITY_TIMEOUT = 10000;

// Never times out 永不过期
const IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt;

// 任务最小堆
const taskQueue = [];
const timerQueue = [];

// 任务ID计数器
let taskIdCounter = 1;

let scheduledHostCallback = null;

// 开始执行任务的时间
let startTime = -1;

// 当前的任务
let currentTask = null;

// React 每一帧向浏览器申请5毫秒，用于自己任务的执行
// 如果5毫秒没有完成，React会放弃控制权，把控制权交给浏览器
const frameInterval = 5;

const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

port1.onmessage = performWorkUntilDeadline;

function getCurrentTime () {
  return performance.now();
}

/**
 * 优先队列
 * @param {*} priorityLevel 
 * @param {*} callback 
 */
export function scheduleCallback (priorityLevel, callback) {
  // 获取当前时间
  const currentTime = getCurrentTime();
  // 此任务开始时间
  const startTime = currentTime;

  let timeout;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;
    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
      break;
    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;
      break;
    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;
      break;
    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT;
      break;
  }

  // 计算此任务的过期时间
  const expirationTime = startTime + timeout;

  const newTask = {
    id: taskIdCounter++,
    callback, // 任务函数
    priorityLevel,
    startTime,
    expirationTime, // 任务的过期时间
    sortIndex: expirationTime,  // 排序依据
  }

  // 向任务最小堆添加任务
  push(taskQueue, newTask);

  requestHostCallback(workLoop);

  return newTask;
}


function workLoop (startTime) {
  let currentTime = startTime;

  // 取出优先级最高的任务
  currentTask = peek(taskQueue);

  while (currentTask !== null) {
    // 如果此任务的过期时间小于当前时间，并且需要放弃执行
    if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
      // 跳出工作循环
      break;
    }

    // 取出当前任务中的回调函数，ReactFiberWorkLoop 中的 performConcurrentWorkOnRoot
    const callback = currentTask.callback;
    if (typeof callback === 'function') {
      currentTask.callback = null;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;

      // 执行工作，如果返回新的函数，则表示当前的工作没有完成
      const continuationCallback = callback(didUserCallbackTimeout);
      if (typeof continuationCallback === 'function') {
        currentTask.callback = continuationCallback;
        return true;
      }

      // 如果此任务已经完成，把此任务弹出去
      if (currentTask === peek(taskQueue)) {
        pop(taskQueue);
      }
    } else {
      pop(taskQueue);
    }

    // 如果当前任务执行完，或者当前任务不合法
    currentTask = peek(taskQueue);
  }

  // 如果循环结束，还有未完成的任务，取出下一个任务
  if (currentTask !== null) {
    return true;
  } else {
    return false;
  }
}

function requestHostCallback (workLoop) {
  // 先缓存回调函数
  scheduledHostCallback = workLoop;

  // 执行工作直到截止时间
  schedulePerformWorkUntilDeadline()
}

function schedulePerformWorkUntilDeadline () {
  port2.postMessage(null);
}

function performWorkUntilDeadline () {
  if (scheduledHostCallback) {
    // 表示时间片开始
    startTime = getCurrentTime();
    let hasMoreWork = true;

    try {
      // 执行 flushWork， 并判断有没有返回值
      hasMoreWork = scheduledHostCallback(startTime);
    } finally {
      // 执行完以后如果为true，说明还有更多工作做
      if (hasMoreWork) {
        schedulePerformWorkUntilDeadline();
      } else {
        // 结束
        scheduledHostCallback = null;
      }
    }
  }
}


function shouldYieldToHost () {
  // 用当前时间 减去 开始时间，就是过去时间
  const timeElapsed = getCurrentTime() - startTime;
  // 如果流逝的时间或者说经过的时间小于5毫秒，就不需要放弃执行
  if (timeElapsed < frameInterval) {
    return false;
  }
  return true;
}

// function flushWork (startTime) {
//   return workLoop(startTime);
// }

export {
  shouldYieldToHost as shouldYield,
  IdlePriority,
  ImmediatePriority,
  LowPriority,
  UserBlockingPriority,
  NormalPriority
}


/**
 
let schedulePerformWorkUntilDeadline;
if (typeof MessageChannel !== 'undefined') {
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;
  schedulePerformWorkUntilDeadline = () => {
    port.postMessage(null);
  };
} else {
  schedulePerformWorkUntilDeadline = () => {
    setTimeout(performWorkUntilDeadline, 0);
  };
}
 */
