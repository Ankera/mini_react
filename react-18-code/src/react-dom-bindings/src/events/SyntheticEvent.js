import assign from "shared/assign";

const MouseEventInterface = {
  clientX: 0,
  clientY: 0,
}

function createSyntheticEvent (interfaces) {
  /**
   * 合成事件基类
   * @param {*} reactName react事件名，onClick
   * @param {*} reactEventType click
   * @param {*} targetInst  事件源对应的fiber
   * @param {*} nativeEvent 原生事件对象
   * @param {*} nativeEventTarget 原生事件源 span 对应的真实 DOM
   */
  function SyntheticBaseEvent (reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
    this._reactName = reactName;
    this.type = reactEventType;
    this._targetInst = targetInst;
    this.nativeEvent = nativeEvent;
    this.target = nativeEventTarget;

    for (const propName in interfaces) {
      if (!interfaces.hasOwnProperty(propName)) {
        continue;
      }
      this[propName] = nativeEvent[propName];
    }

    // 是否阻止默认事件
    this.isDefaultPrevented = functionThatReturnsFalse;

    // 是否阻止传播
    this.isPropagationtopped = functionThatReturnsFalse;

    return this;
  }

  assign(SyntheticBaseEvent.prototype, {
    preventDefault () {
      const event = this.nativeEvent;
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      this.isDefaultPrevented = functionThatReturnsTrue;
    },

    stopPropagation () {
      const event = this.nativeEvent;
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      this.isPropagationtopped = functionThatReturnsTrue;
    }
  })

  return SyntheticBaseEvent;
}

function functionThatReturnsTrue () {
  return true;
}

function functionThatReturnsFalse () {
  return false;
}

export const SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface);