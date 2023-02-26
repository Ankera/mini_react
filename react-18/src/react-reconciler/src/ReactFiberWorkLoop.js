import { scheduleCallback } from 'scheduler';
import { createWorkInProgress } from './ReactFiber';
import { beginWork } from './ReactFiberBeginWork';
import { completeWork } from './ReactFiberCompleteWork';
import { ChildDeletion, MutationMask, NoFlags, Passive, Placement, Update } from './ReactFiberFlags';
import {
  commitMuationEffectsOnFiber, // 执行 DOM操作
  commitPassiveUnmountEffects, // 执行 destroy
  commitPassiveMountEffects,// 执行 create
  commitLayoutEffects,
} from './ReactFiberCommitWork';
import { FunctionComponent, HostComponent, HostRoot, HostText } from './ReactWorkTags';
import { finishQueueingConcurrentUpdates } from './ReactFiberCocurrentUpdates';

let workInProgress = null;

let workInProgressRoot = null;

// 此根节点上有没有 useEffect 类似的副作用
let rootDoesHavePassiveEffect = false;

// 具有 useEffect 副作用的根节点，FiberRootNode， 根 fiber.stateNode
let rootWithPendingPassiveEffect = null;

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

/**
 * 异步的
 * @param {*} root 
 */
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

  unitOfWork.memoizedProps = unitOfWork.pendingProps;

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

function flushPassiveEffect () {
  console.log('~~~~~~~~~~~~~~~~~下一个宏任务中~~~~~~~~~~~~~~~~~~~~');
  if (rootWithPendingPassiveEffect !== null) {
    const root = rootWithPendingPassiveEffect;
    // 执行卸载副作用 destroy
    commitPassiveUnmountEffects(root.current);

    // 执行挂载副作用 create
    commitPassiveMountEffects(root, root.current);
  }
}

/**
 * 提交阶段
 * @param {*} root 
 */
function commitRoot (root) {
  // 先获取新构建好的 fiber 树的根节点
  const { finishedWork } = root;
  if ((finishedWork.subtreeFlags & Passive) !== NoFlags || (finishedWork.flags & Passive) !== NoFlags) {
    if (!rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = true;
      scheduleCallback(flushPassiveEffect.bind(null, root));
    }
  }

  console.log('~~~~~~~~~~~~~~~~~开始commit~~~~~~~~~~~~~~~~~~~~');
  // 打印完成工作的副作用
  // printFinishedWork(finishedWork);

  // 判断子树有没有副作用
  const subtreeFlags = (finishedWork.subtreeFlags & MutationMask) != NoFlags;
  const rootFlags = (finishedWork.flags & MutationMask) != NoFlags;
  if (subtreeFlags || rootFlags) {
    console.log('~~~~~~~~~~~~~~~~~DOM执行变更~~~~~~~~~~~~~~~~~~~~');
    // 当 DOM 执行变更之后
    commitMuationEffectsOnFiber(finishedWork, root);

    console.log('~~~~~~~~~~~~~~~~~DOM执行变更后~~~~~~~~~~~~~~~~~~~~');
    // DOM变更之后，UI渲染之前
    commitLayoutEffects(finishedWork, root);

    if (rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = false;
      rootWithPendingPassiveEffect = root;
    }
  }

  root.current = finishedWork;
}

function printFinishedWork (fiber) {
  // debugger
  const { flags, deletions } = fiber;
  if ((flags & ChildDeletion) !== NoFlags) {
    fiber.flags &= (~ChildDeletion);
    console.log('子节点删除' + (deletions.map((f) => `${f.type}#${f.memoizedProps.id}`).join(',')))
  }

  let child = fiber.child;
  while (child) {
    printFinishedWork(child);
    child = child.sibling;
  }

  if (fiber.flags !== NoFlags) {
    console.log(getFlags(fiber), getTag(fiber.tag), typeof fiber.type === 'function' ? fiber.type.name : fiber.type, fiber.memoizedProps);
  }
}

function getFlags (fiber) {
  const { flags, deletions } = fiber;
  if (flags === (Placement | Update)) {
    return '移动';
  }
  if (flags === Placement) {
    return '插入';
  }
  if (flags === Update) {
    return '更新'
  }

  return flags;
}

function getTag (tag) {
  switch (tag) {
    case FunctionComponent:
      return 'FunctionComponent';
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