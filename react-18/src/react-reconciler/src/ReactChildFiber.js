import isArray from 'shared/isArray';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { createFiberFromElement, createFiberFromText, createWorkInProgress } from './ReactFiber';
import { ChildDeletion, Placement } from './ReactFiberFlags';
import { HostText } from './ReactWorkTags';

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

  function placeChild (newFiber, lastPlaceIndex, newIndex) {
    newFiber.index = newIndex;

    if (!shouldTrackSideEffects) {
      return lastPlaceIndex;
    }

    const current = newFiber.alternate;
    // 有老 fiber，说明是老的，
    if (current !== null) {
      const oldIndex = current.index;
      if (oldIndex < lastPlaceIndex) {
        newFiber.flags |= Placement;
        return lastPlaceIndex;
      } else {
        return oldIndex;
      }
    } else {
      // 插入
      newFiber.flags |= Placement;
      return lastPlaceIndex;
    }
  }

  function updateElement (returnFiber, current, element) {
    const elementType = element.type;
    if (current !== null) {
      // 类型一样，可以复用
      if (current.type === elementType) {
        const existing = useFiber(current, element.props);
        existing.return = returnFiber;
        return existing;
      }
    }

    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  function updateSlot (returnFiber, oldFiber, newChild) {
    const key = oldFiber !== null ? oldFiber.key : null;
    if (newChild !== null && typeof newChild === 'object') {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          if (newChild.key === key) {
            return updateElement(returnFiber, oldFiber, newChild)
          }
        }
        default:
          return null;
      }
    }
    return null;
  }

  /**
   * 
   * @param {*} returnFiber 
   * @param {*} currentFirstChild 
   * @returns 
   */
  function mapRemainingChildren (returnFiber, currentFirstChild) {
    let existingChildren = new Map();
    let existingChild = currentFirstChild;
    while (existingChild !== null) {
      if (existingChild.key !== null) {
        existingChildren.set(existingChild.key, existingChild);
      } else {
        existingChildren.set(existingChild.index, existingChild);
      }

      existingChild = existingChild.sibling;
    }

    return existingChildren;
  }

  function updateTextNode (returnFiber, current, textContent) {
    if (current === null || current.tag !== HostText) {
      const created = createFiberFromText(textContent);
      created.return = returnFiber;
      return created;
    } else {
      const existing = useFiber(current, textContent);
      existing.return = returnFiber;
      return existing;
    }
  }

  function updateFromMap (existingChildren, returnFiber, newIndex, newChild) {
    if ((typeof newChild === 'string' && newChild !== '') || typeof newChild === 'number') {
      const matchedFiber = existingChildren.get(newIndex) || null;
      return updateTextNode(returnFiber, matchedFiber, `${newChild}`);
    }
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const matchedFiber = existingChildren.get(newChild.key === null ? newChild.index : newChild.key) || null;
          return updateElement(returnFiber, matchedFiber, newChild)
        }
      }
    }
  }

  function reconcileChildrenArray (returnFiber, currentFirstChild, newChildren) {
    // 返回的第一个新儿子
    let resultingFirstChild = null;
    let previousNewFiber = null;
    let newIndex = 0; // 用来遍历新虚拟DOM索引
    let oldFiber = currentFirstChild;
    let nextOldFiber = null;
    let lastPlaceIndex = 0; // 上一个不需要移动老节点的索引

    // 开始第一轮循环
    for (; oldFiber !== null && newIndex < newChildren.length; newIndex++) {
      nextOldFiber = oldFiber.sibling;
      // 试图更新或者复用老的fiber
      const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIndex]);

      // 找不到就跳出第一轮循环
      if (newFiber === null) {
        break;
      }
      if (shouldTrackSideEffects) {
        // 新创建的，没有复用老的fiber
        if (oldFiber && newFiber.alternate === null) {
          deleteChild(returnFiber, oldFiber)
        }
      }

      lastPlaceIndex = placeChild(newFiber, lastPlaceIndex, newIndex);

      if (previousNewFiber === null) {
        resultingFirstChild = newFiber; // li(#A)
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;

      oldFiber = nextOldFiber;
    }

    // 新的虚拟DOM用完, 删除老fiber
    if (newIndex === newChildren.length) {
      deleteRemainingChild(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // 插入
      for (; newIndex < newChildren.length; newIndex++) {
        const newFiber = createChild(returnFiber, newChildren[newIndex]);
        if (newFiber === null) {
          continue;
        }

        lastPlaceIndex = placeChild(newFiber, lastPlaceIndex, newIndex);

        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }

        previousNewFiber = newFiber;
      }
    }

    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
    for (; newIndex < newChildren.length; newIndex++) {
      const newFiber = updateFromMap(existingChildren, returnFiber, newIndex, newChildren[newIndex]);
      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          // 跟踪副作用，有老fiber
          if (newFiber.alternate !== null) {
            existingChildren.delete(newFiber.key === null ? newIndex : newFiber.key)
          }
        }
        lastPlaceIndex = placeChild(newFiber, lastPlaceIndex, newIndex);

        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }

        previousNewFiber = newFiber;
      }
    }

    if (shouldTrackSideEffects) {
      existingChildren.forEach((child) => {
        deleteChild(returnFiber, child);
      })
    }

    return resultingFirstChild;
  }

  function useFiber (fiber, newProps) {
    const clone = createWorkInProgress(fiber, newProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }

  function deleteChild (returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) {
      return;
    }

    const deletions = returnFiber.deletions;
    if (deletions === null) {
      returnFiber.deletions = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      returnFiber.deletions.push(childToDelete);
    }
  }

  function deleteRemainingChild (returnFiber, currentFirstChild) {
    if (!shouldTrackSideEffects) {
      return;
    }
    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
  }

  /**
   * 
   * @param {*} returnFiber div#root
   * @param {*} currentFirstChild 老的 FunctionComponent 对应的 fiber
   * @param {*} element 
   * @returns 
   */
  function reconcileSingleElement (returnFiber, currentFirstChild, element) {
    const key = element.key;
    let child = currentFirstChild;
    while (child !== null) {
      if (child.key === key) {
        if (child.type === element.type) {
          deleteRemainingChild(returnFiber, child.sibling);
          const existing = useFiber(child, element.props);
          existing.return = returnFiber;
          return existing;
        } else {
          deleteRemainingChild(returnFiber, child);
        }
      } else {
        deleteChild(returnFiber, child);
      }

      child = child.sibling;
    }

    // 根据新的虚拟DOM，创建新的fiber节点
    const created = createFiberFromElement(element);

    created.return = returnFiber;

    return created;
  }

  function placeSingleChild (newFiber) {
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.flags |= Placement;
    }

    return newFiber;
  }

  /**
   * 
   * @param {*} returnFiber 
   * @param {*} currentFirstChild 
   * @param {*} newChild 
   */
  function reconcileChildFibers (returnFiber, currentFirstChild, newChild) {
    if (newChild !== null && typeof newChild === 'object') {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          const newFiber = reconcileSingleElement(returnFiber, currentFirstChild, newChild);
          return placeSingleChild(newFiber);
        default:
          break;
      }
    }

    // []
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild)
    }

    return null;
  }

  return reconcileChildFibers;
}

export const mountChildFibers = createChildReconciler(false);

export const reconcileChildFibers = createChildReconciler(true);