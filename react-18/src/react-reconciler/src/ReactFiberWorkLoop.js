import { scheduleCallback } from 'scheduler';
import { createWorkInProgress } from './ReactFiber';
import { beginWork } from './ReactFiberBeginWork';
import { completeWork } from './ReactFiberCompleteWork';
import { MutationMask, NoFlags, Placement, Update } from './ReactFiberFlags';
import { commitMuationEffectsOnFiber } from './ReactFiberCommitWork';
import { HostComponent, HostRoot, HostText } from './ReactWorkTags';
import { finishQueueingConcurrentUpdates } from './ReactFiberCocurrentUpdates';

let workInProgress = null;

let workInProgressRoot = null;

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
  if (workInProgressRoot) return;
  workInProgressRoot = root;
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

function performConcurrentWorkOnRoot (root) {
  // 第一次渲染以同步的方式渲染根节点，初次渲染的时候，都是同步
  renderRootSync(root);

  // 开始进入提交阶段，就是执行副作用
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;

  commitRoot(root);

  workInProgressRoot = null;
}

function renderRootSync (root) {
  // 开始构建 fiber 树
  prepareFreshStack(root);

  workLoopSync();
}

function prepareFreshStack (root) {
  workInProgress = createWorkInProgress(root.current, null);

  // hook 更新
  finishQueueingConcurrentUpdates();
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

  unitOfWork.memomizedProps = unitOfWork.pendingProps;

  // 如果没有子节点，表示当前 fiber 已经完成了
  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork (unitOfWork) {
  let completedWork = unitOfWork;

  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;

    completeWork(current, completedWork);

    // 如果有弟弟，就构建弟弟对应fiber子链表
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }

    // 如果没有弟弟，说明当前完成的就是父fiber的最后一个节点
    // 也就是说一个父fiber，所有的子fiber全部完成了
    completedWork = returnFiber;
    workInProgress = completedWork;

  } while (completedWork !== null);
}

/**
 * 提交阶段
 * @param {*} root 
 */
function commitRoot (root) {
  const { finishedWork } = root;

  // 打印完成工作的副作用
  printFinishedWork(finishedWork);

  // 判断子树有没有副作用
  const subtreeFlags = (finishedWork.subtreeFlags & MutationMask) != NoFlags;
  const rootFlags = (finishedWork.flags & MutationMask) != NoFlags;
  if (subtreeFlags || rootFlags) {
    commitMuationEffectsOnFiber(finishedWork, root);
  }

  root.current = finishedWork;
}

function printFinishedWork (fiber) {
  if (fiber.flags !== NoFlags) {
    // console.log('副作用标识=> ', getFlags(fiber.flags), getTag(fiber.tag), fiber.type, fiber.memomizedProps);
  }

  let child = fiber.child;
  while (child) {
    printFinishedWork(child);
    child = child.sibling;
  }
}

function getFlags (flags) {
  if (flags === Placement) {
    return '插入';
  }
  if (flags === Update) {
    return '更新';
  }

  return flags;
}

function getTag (tag) {
  switch (tag) {
    case HostRoot:
      return 'HostRoot';
    case HostComponent:
      return 'HostComponent';
    case HostText:
      return 'HostText';
    default:
      return tag;
  }
}