import { appendChild, insertBefore } from "react-dom-bindings/src/client/ReactDOMHostConfig";
import { Placement, MutationMask } from "./ReactFiberFlags";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";

/**
 * 遍历fiber树，执行fiber上的副作用
 * @param {*} finishedWork 
 * @param {*} root 
 */
export function commitMuationEffectsOnFiber (finishedWork, root) {
  switch (finishedWork.tag) {
    case HostRoot:
    case HostComponent:
    case HostText: {
      // 先遍历他们的子节点，处理他们子几点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork);

      // 再处理自己身上的副作用
      commitReconciliationEffects(finishedWork);
    }
    default:
      break;
  }
}

function recursivelyTraverseMutationEffects (root, parentFiber) {
  if (parentFiber.subtreeFlags & MutationMask) {
    let { child } = parentFiber;
    while (child != null) {
      commitMuationEffectsOnFiber(child, root);
      child = child.siblings;
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
    while (node.tag !== HostComponent || node.tag !== HostText) {
      // 如果此节点是一个将要插入的新节点，找它的弟弟
      if (node.flags & Placement) {
        continue siblings;
      } else {
        node = node.child;
      }
    }

    if (!(node.tag & Placement)) {
      return node.stateNode;
    }
  }
}

/**
 * 
 * @param {*} node 将要插入的fiber节点
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
      insertOrAppendPlacementNode(child, parent);
      let { sibling } = child;
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, parent);
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