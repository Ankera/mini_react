import { scheduleCallback } from 'scheduler';
import { createWorkInProgress } from './ReactFiber';
import { beginWork } from './ReactFiberBeginWork'

let workInProgress = null;

/**
 * 计划更新root
 * 源码中此处有一个任务功能
 * @param {*} root 
 */
export function scheduledUpdateOnFiber (root) {
  // 确保调度执行root上的更新
  ensureRootInScheduled(root);
}

/**
 * 告诉浏览器执行 performConcurrentWorkOnRoot
 * @param {*} root 
 */
function ensureRootInScheduled (root) {
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

function performConcurrentWorkOnRoot (root) {
  // 第一次渲染以同步的方式渲染根节点，初次渲染的时候，都是同步
  renderRootSync(root)
}

function prepareFreshStack (root) {
  workInProgress = createWorkInProgress(root.current, null);
  console.log(workInProgress);
}

function renderRootSync (root) {
  // 开始构建 fiber 树
  prepareFreshStack(root);

  workLoopSync();
}

function workLoopSync () {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork (unitOfWork) {
  // 获取信的fiber对应老的fiber
  const current = unitOfWork.alternate;

  const next = beginWork(current, unitOfWork);

  unitOfWork.memomizedProps = unitOfWork.memomizedProps;

  // 如果没有子节点，表示当前 fiber 已经完成了
  if (next === null) {
    // completeUnitOfWork(unitOfWork)
    workInProgress = null;
  } else {
    workInProgress = next;
  }
}