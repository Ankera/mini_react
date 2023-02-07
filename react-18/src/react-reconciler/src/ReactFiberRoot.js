import { createHostRootFiber } from './ReactFiber';
import { initialUpdateQueue } from './ReactFiberClassUpdateQueue';

// fiber 根节点，真实的 dom 节点
class FiberRootNode {
  constructor(containerInfo) {
    this.containerInfo = containerInfo;
  }
}

export function createFiberRoot (containerInfo) {
  const root = new FiberRootNode(containerInfo);

  // hostRoot 就是跟节点 div#root
  const uninitializeFiber = createHostRootFiber();

  root.current = uninitializeFiber;

  uninitializeFiber.stateNode = root;

  initialUpdateQueue(uninitializeFiber);

  return root;
}