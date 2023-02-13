import { HostComponent, HostRoot, HostText, IndeterminateComponent } from './ReactWorkTags';
import { NoFlags } from './ReactFiberFlags';

/**
 * 
 * @param {*} tag 0 是函数组件，1是类组件，3是跟元素，5是div、span
 * @param {*} pendingProps 新属性，等待处理或者生效的属性
 * @param {*} key 
 */
export function FiberNode (tag, pendingProps, key) {
  this.tag = tag;
  this.key = key;
  this.type = null; // div,span,h1,p
  this.stateNode = null;

  this.index = 0;

  this.return = null; // 指向父节点
  this.child = null;  // 指向第一个子节点
  this.sibling = null;  // 指向弟弟

  this.pendingProps = pendingProps;
  this.memoizedProps = null; // 已经生效的属性

  /**
   * 每个fiber都有自己的状态，每一种fiber状态存的状态是不一样的
   * * 类组件对应 fiber 存的的是类的实例
   * * HostRoot fiber 存的是要渲染的元素
   */
  this.memoizedState = null;

  // 可能要更新的队列
  this.updateQueue = null;

  // 副作用标识，表示要针对 fiber 节点进行何种操作
  this.flags = NoFlags;
  // 子节点对应的副作用标识
  this.subtreeFlags = NoFlags;

  this.alternate = null;
}

export function createFiber (tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

export function createHostRootFiber () {
  return createFiber(HostRoot, null, null)
}

/**
 * 基于老的fiber和新的属性，创建新的fiber
 * current 和 workInProgress 不是同一个对象
 * 
 * 所谓的复用
 *    1、复用老的 fiber 对象
 *    2、复用老的 DOM 
 * @param {*} current 
 * @param {*} pendingProps 新属性
 */
export function createWorkInProgress (current, pendingProps) {
  let workInProgress = current.alternate;

  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
  }

  workInProgress.child = current.child;
  workInProgress.sibling = current.sibling;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.index = current.index;

  return workInProgress;
}

/**
 * 根据新的虚拟DOM，创建新的fiber节点
 * @param {*} element 
 */
export function createFiberFromElement (element) {
  const { type, key, props } = element;

  return createFiberFromTypeAndProps(type, key, props);
}

function createFiberFromTypeAndProps (type, key, pendingProps) {
  let tag = IndeterminateComponent;

  // div, span, h1
  if (typeof type === 'string') {
    tag = HostComponent;
  }

  const fiber = createFiber(tag, pendingProps, key);
  fiber.type = type;
  return fiber;
}

export function createFiberFromText (content) {
  const fiber = createFiber(HostText, content, null);

  return fiber;
}