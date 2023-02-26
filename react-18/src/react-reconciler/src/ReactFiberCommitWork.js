import { appendChild, insertBefore, commitUpdate, removeChild } from "react-dom-bindings/src/client/ReactDOMHostConfig";
import { Placement, MutationMask, Update, Passive } from "./ReactFiberFlags";
import { FunctionComponent, HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import { HasEffect as HookHasEffect, Passive as HookPassive } from './ReactHooksEffectTags';

let hostParent = null;

/**
 * 遍历fiber树，执行fiber上的副作用
 * @param {*} finishedWork 
 * @param {*} root 
 */
export function commitMuationEffectsOnFiber (finishedWork, root) {
  const current = finishedWork.alternate;
  const flags = finishedWork.flags;

  switch (finishedWork.tag) {
    case HostRoot:
    case FunctionComponent:
    case HostText: {
      // 先遍历他们的子节点，处理他们子几点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork);

      // 再处理自己身上的副作用
      commitReconciliationEffects(finishedWork);
      break;
    }
    case HostComponent: {
      // 先遍历他们的子节点，处理他们子几点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork);

      // 再处理自己身上的副作用
      commitReconciliationEffects(finishedWork);

      // 处理DOM更新
      if (flags & Update) {
        const instance = finishedWork.stateNode;
        if (instance !== null) {
          const newProps = finishedWork.memoizedProps;
          const oldProps = current !== null ? current.memoizedProps : newProps;
          const type = finishedWork.type;
          const updatePayload = finishedWork.updateQueue;
          finishedWork.updateQueue = null;
          if (updatePayload) {
            commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork);
          }
        }
      }
      break;
    }
    default:
      break;
  }
}

function commitDeletionEffects (root, returnFiber, deletedFiber) {
  let parent = returnFiber;
  findParent: while (parent !== null) {
    switch (parent.tag) {
      case HostComponent: {
        hostParent = parent.stateNode;
        break findParent;
      }
      case HostRoot: {
        hostParent = parent.stateNode.containerInfo;
        break findParent;
      }
    }
    parent = parent.return;
  }

  commitDeletionEffectsOnFiber(root, returnFiber, deletedFiber);
  hostParent = null;
}

function commitDeletionEffectsOnFiber (finishedRoot, nearestMountedAncestor, deletedFiber) {
  switch (deletedFiber.tag) {
    case HostComponent:
    case HostText: {
      // 遍历子节点删除，先删除子节点
      recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);

      // 再删除自己
      if (hostParent !== null) {
        removeChild(hostParent, deletedFiber.stateNode);
      }
      break;
    }
    default:
      break;
  }
}

function recursivelyTraverseDeletionEffects (finishedRoot, nearestMountedAncestor, parent) {
  let child = parent.child;
  while (child !== null) {
    commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, child);
    child = child.sibling;
  }
}

/**
 * 递归处理变更的副作用
 * @param {*} root 
 * @param {*} parentFiber 
 */
function recursivelyTraverseMutationEffects (root, parentFiber) {
  // 先把父节点要删除的全部删除
  const deletions = parentFiber.deletions;
  if (deletions !== null) {
    for (let i = 0; i < deletions.length; i++) {
      const childToDelete = deletions[i];
      commitDeletionEffects(root, parentFiber, childToDelete);
    }
  }

  if (parentFiber.subtreeFlags & MutationMask) {
    let { child } = parentFiber;
    while (child != null) {
      commitMuationEffectsOnFiber(child, root);
      child = child.sibling;
    }
  }
}

function commitReconciliationEffects (finishedWork) {
  const { flags } = finishedWork;
  if (flags & Placement) {
    // 进行操作插入，把此 fiber 对应的真实 DOM 节点添加到父真实 DOM 上
    commitPlacement(finishedWork);

    // 把 flags 里面的 Placement 删除
    finishedWork.flags & ~Placement;
  }
}

function commitPlacement (finishedWork) {
  const parentFiber = getHostParentFiber(finishedWork);

  switch (parentFiber.tag) {
    case HostRoot: {
      const parent = parentFiber.stateNode.containerInfo;
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNode(finishedWork, before, parent);
    }
      break;
    case HostComponent: {
      const parent = parentFiber.stateNode;
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNode(finishedWork, before, parent);
    }
    default:
      break;
  }
}

/**
 * 课时67 - 45分开始
 * https://www.javascriptpeixun.cn/course/3545/task/333611/show
 * 找到要插入的锚点
 * @param {} fiber 
 */
function getHostSibling (fiber) {
  let node = fiber;
  siblings: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node)) {
        return null;
      }
      node = node.return;
    }

    node = node.sibling;

    // 如果弟弟不是原生节点也不是文本节点
    while (node.tag !== HostComponent && node.tag !== HostText) {
      // 如果此节点是一个将要插入的新节点，找它的弟弟
      if (node.flags & Placement) {
        continue siblings;
      } else {
        node = node.child;
      }
    }

    if (!(node.flags & Placement)) {
      return node.stateNode;
    }
  }
}

/**
 * 
 * @param {*} node 将要插入的fiber节点
 * @param {*} before 插入那个DOM前面
 * @param {*} parent 父真实DOM节点
 */
function insertOrAppendPlacementNode (node, before, parent) {
  const { tag } = node;
  const isHost = tag === HostComponent || tag === HostText;
  if (isHost) {
    const { stateNode } = node;
    if (before) {
      insertBefore(parent, stateNode, before);
    } else {
      appendChild(parent, stateNode);
    }
  } else {
    const { child } = node;
    if (child !== null) {
      insertOrAppendPlacementNode(child, before, parent);
      let { sibling } = child;
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}

function getHostParentFiber (fiber) {
  let parent = fiber.return;
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }
    parent = parent.return;
  }
  return null;
}

function isHostParent (fiber) {
  return fiber.tag === HostRoot || fiber.tag === HostComponent;
}


// ================================== unMount ===========================================

export function commitPassiveUnmountEffects (finishedWork) {
  commitPassiveUnmountOnFiber(finishedWork);
}

function commitPassiveUnmountOnFiber (finishedWork) {
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case HostRoot: {
      recursivelyTraversePassiveUnMountEffects(finishedWork);
      break;
    }
    case FunctionComponent: {
      recursivelyTraversePassiveUnMountEffects(finishedWork);
      if (flags & Passive) {
        commitHookPassiveUnMountEffects(finishedWork, HookPassive | HookHasEffect);
      }
      break;
    }
  }
}

function recursivelyTraversePassiveUnMountEffects (parentFiber) {
  if (parentFiber.subtreeFlags & Passive) {
    let child = parentFiber.child;
    while (child !== null) {
      commitPassiveUnmountOnFiber(child);
      child = child.sibling;
    }
  }
}

function commitHookPassiveUnMountEffects (finishedWork, hookFlags) {
  commitHookEffectListUnMount(hookFlags, finishedWork);
}

function commitHookEffectListUnMount (flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      if ((effect.tag & flags) === flags) {
        const destroy = effect.destroy;
        if (typeof destroy !== 'undefined') {
          destroy();
        }
      }
      effect = effect.next;
    } while (effect !== firstEffect)
  }
}


// ================================== mount ===========================================

export function commitPassiveMountEffects (root, finishedWork) {
  commitPassiveMountOnFiber(root, finishedWork);
}

function commitPassiveMountOnFiber (finishedRoot, finishedWork) {
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case HostRoot: {
      recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
      break;
    }
    case FunctionComponent: {
      recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
      if (flags & Passive) {
        commitHookPassiveMountEffects(finishedWork, HookPassive | HookHasEffect);
      }
      break;
    }
  }
}

function recursivelyTraversePassiveMountEffects (root, parentFiber) {
  if (parentFiber.subtreeFlags & Passive) {
    let child = parentFiber.child;
    while (child !== null) {
      commitPassiveMountOnFiber(root, child);
      child = child.sibling;
    }
  }
}

function commitHookPassiveMountEffects (finishedWork, hookFlags) {
  commitHookEffectListMount(hookFlags, finishedWork);
}

function commitHookEffectListMount (flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      if ((effect.tag & flags) === flags) {
        const create = effect.create;
        effect.destroy = create();
      }
      effect = effect.next;
    } while (effect !== firstEffect)
  }
}