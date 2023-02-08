
import getEventTarget from './getEventTarget';
import { getClosestInstanceFromNode } from '../client/ReactDOMComponentTree';
import { dispatchEventForPluginEventSystem } from './DOMPluginEventSystem';

export function createEventListenerWrapperWithPriority (
  targetContainer, domEventName, evnetSystemFlags
) {
  const listenerWrapper = dispatchDiscreteEvent;
  return listenerWrapper.bind(null, domEventName, evnetSystemFlags, targetContainer);
}

/**
 * 派发离散事件的监听函数
 * @param {*} domEventName 事件名 click
 * @param {*} evnetSystemFlags 阶段 0冒泡， 4捕获
 * @param {*} container div#root
 * @param {*} nativeEvent 原生的事件
 */
function dispatchDiscreteEvent (domEventName, evnetSystemFlags, targetContainer, nativeEvent) {
  dispatchEvent(domEventName, evnetSystemFlags, targetContainer, nativeEvent)
}

export function dispatchEvent (domEventName, evnetSystemFlags, targetContainer, nativeEvent) {
  // 获取事件源，它是一个真实DOM
  const nativeEventTarget = getEventTarget(nativeEvent);

  const targetInst = getClosestInstanceFromNode(nativeEventTarget);

  dispatchEventForPluginEventSystem(
    domEventName,
    evnetSystemFlags,
    nativeEvent,
    targetInst,
    targetContainer
  );
}