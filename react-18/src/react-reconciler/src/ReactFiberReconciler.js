import { createFiberRoot } from './ReactFiberRoot';
import { createUpdate, enqeueUpdate } from './ReactFiberClassUpdateQueue';
import { scheduledUpdateOnFiber } from './ReactFiberWorkLoop';

/**
 * 在跟节点上创建fiber容器
 * @param {*} containerInfo 
 * @returns 
 */
export function createContainer (containerInfo) {
  return createFiberRoot(containerInfo)
}

/**
 * 更新容器
 * @param {*} element 虚拟DOM
 * @param {*} container FiberRootNode
 */
export function updateContainer (element, container) {
  // 根 fiber，获取当前的根 fiber
  const current = container.current;

  // 创建更新
  const update = createUpdate();

  // 要更新的虚拟 dom
  update.payload = { element };

  // 把此更新对象添加到 current 这个根 fiber 的更新队列上
  const root = enqeueUpdate(current, update);

  scheduledUpdateOnFiber(root);

  return root;
}