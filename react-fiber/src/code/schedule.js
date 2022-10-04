
import {
  ELEMENT_TEXT,
  TAG_HOST,
  TAG_TEXT,
  PLACEMENT,
  TAG_ROOT
} from './contant'

let nextUnitOfWork = null;
let workInProgressRoot = false;

function scheduleRoot (rootFiber) {
  nextUnitOfWork = rootFiber;
  workInProgressRoot = rootFiber;
}

function workLoop (deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork) {
    console.log('render阶段结束');
  }

  requestIdleCallback(workLoop, { timeout: 500 });
}

function performUnitOfWork (currentFiber) {
  beginWork(currentFiber);

  if (currentFiber.child) {
    return currentFiber.child;
  }

  while (currentFiber) {
    if (currentFiber.sibling) {
      return currentFiber.sibling;
    }

    currentFiber = currentFiber.return;
  }
}

function beginWork (currentFiber) {
  if (currentFiber.tag === TAG_ROOT) {
    updateHostRoot(currentFiber)
  }
}

function updateHostRoot (currentFiber) {
  const newChildren = currentFiber.props.children;
  reconclieChildren(currentFiber, newChildren)
}

function reconclieChildren (currentFiber, newChildren) {
  let newChildIndex = 0;
  let prevSibling = null;
  while (newChildIndex < newChildren.length) {
    let newChild = newChildren[newChildIndex];
    let tag = null;
    if (newChild.type === ELEMENT_TEXT) {
      tag = TAG_TEXT;
    } else if (typeof newChild.type === 'string') {
      tag = TAG_HOST;
    }

    let newFiber = {
      tag,
      type: newChild.type,
      props: newChild.props,
      stateNode: null,
      return: currentFiber,
      effectTag: PLACEMENT,
      nextEffect: null,
    }

    if (newFiber) {
      if (newChildIndex === 0) {
        currentFiber.child = newFiber;
      } else {
        prevSibling.sibling = newFiber;
      }
      prevSibling = newFiber;
    }

    newChildIndex++;
  }
}

// requestIdleCallback(workLoop, { timeout: 500 });

export {
  scheduleRoot
}