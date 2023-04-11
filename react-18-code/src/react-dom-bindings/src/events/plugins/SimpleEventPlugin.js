import { registerSimpleEvents, topLevelEventsToReactNames } from '../DOMEventProperties';
import { IS_CAPTURE_PHASE } from '../EventSystemFlags';
import { accumulateSinglePhaseListeners } from '../DOMPluginEventSystem';
import { SyntheticMouseEvent } from '../SyntheticEvent'

export { registerSimpleEvents as registerEvents };

/**
 * 提取事件
 * 把要执行的回调函数添加到派发队列dispatchQueue中
 * @param {*} dispatchQueue 
 * @param {*} domEventName DOM 事件 click
 * @param {*} targetInst 目标fiber
 * @param {*} nativeEvent 原生事件
 * @param {*} nativeEventTarget 原生事件源
 * @param {*} evnetSystemFlags 
 * @param {*} targetContainer 目标容器
 */
export function extractEvents (
  dispatchQueue,
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget,
  evnetSystemFlags,
  targetContainer
) {
  const isCapturePhase = (evnetSystemFlags & IS_CAPTURE_PHASE) !== 0;
  const reactName = topLevelEventsToReactNames.get(domEventName);
  let SyntheticEventCtor; // 合成事件构造函数

  switch (domEventName) {
    case 'click':
      SyntheticEventCtor = SyntheticMouseEvent;
    default:
      break;
  }

  const listeners = accumulateSinglePhaseListeners(
    targetInst,
    reactName,
    nativeEvent.type,
    isCapturePhase
  );
  if (listeners.length > 0) {
    const event = new SyntheticEventCtor(reactName, domEventName, null, nativeEvent, nativeEventTarget);
    dispatchQueue.push({
      event,
      listeners
    });
  }
}