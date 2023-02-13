import isArray from 'shared/isArray';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { createFiberFromElement, createFiberFromText, createWorkInProgress } from './ReactFiber';
import { Placement } from './ReactFiberFlags';

/**
 * 
 * @param {*} shouldTrackSideEffect 是否跟踪副作用
 */
function createChildReconciler (shouldTrackSideEffects) {

  function createChild (returnFiber, newChild) {
    if ((typeof newChild === 'string' && newChild !== '') || typeof newChild === 'number') {
      const created = createFiberFromText(`${newChild}`);
      created.return = returnFiber;
      return created;
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          const created = createFiberFromElement(newChild);
          created.return = returnFiber;
          return created;
        default:
          break;
      }
    }
    return null;
  }

  function placeChild (newFiber, newIndex) {
    newFiber.index = newIndex;

    if (shouldTrackSideEffects) {
      newFiber.flags |= Placement;
    }

    return newFiber;
  }

  function reconcileChildrenArray (returnFiber, currentFirstFiber, newChildren) {
    let resultingFirstChild = null;
    let previousNewFiber = null;
    let newIndex = 0;
    for (; newIndex < newChildren.length; newIndex++) {
      const newFiber = createChild(returnFiber, newChildren[newIndex]);
      if (newFiber === null) {
        continue;
      }

      placeChild(newFiber, newIndex);

      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }

      previousNewFiber = newFiber;
    }

    return resultingFirstChild;
  }

  function useFiber (fiber, newProps) {
    const clone = createWorkInProgress(fiber, newProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }

  /**
   * 
   * @param {*} returnFiber div#root
   * @param {*} currentFirstFiber 老的 FunctionComponent 对应的 fiber
   * @param {*} element 
   * @returns 
   */
  function reconcileSingleElement (returnFiber, currentFirstFiber, element) {
    const key = element.key;
    let child = currentFirstFiber;
    while (child !== null) {
      if (child.key === key) {
        if (child.type === element.type) {
          const existing = useFiber(child, element.props);
          existing.return = returnFiber;
          return existing;
        }
      }

      child = child.sibling;
    }

    // 根据新的虚拟DOM，创建新的fiber节点
    const created = createFiberFromElement(element);

    created.return = returnFiber;

    return created;
  }

  function placeSingleChild (newFiber) {
    if (shouldTrackSideEffects) {
      newFiber.flags |= Placement;
    }

    return newFiber;
  }

  /**
   * 
   * @param {*} returnFiber 
   * @param {*} currentFirstFiber 
   * @param {*} newChild 
   */
  function reconcileChilFibers (returnFiber, currentFirstFiber, newChild) {
    if (newChild !== null && typeof newChild === 'object') {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          const newFiber = reconcileSingleElement(returnFiber, currentFirstFiber, newChild);
          return placeSingleChild(newFiber);
        default:
          break;
      }
    }

    // []
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild)
    }

    return null;
  }

  return reconcileChilFibers;
}

export const mountChildFibers = createChildReconciler(false);

export const reconcileChilFibers = createChildReconciler(true);