
import { allNativeEvents } from './EventRegistry';
import * as SimpleEventPlugin from './plugins/SimpleEventPlugin';
import { IS_CAPTURE_PHASE } from './EventSystemFlags';
import { createEventListenerWrapperWithPriority } from './ReactDOMEventListener';
import { addEventCaptureListener, addEventBubbleListener } from './EventListener';
import getEventTarget from './getEventTarget';
import { HostComponent } from 'react-reconciler/src/ReactWorkTags';
import getListener from './getListener';

// 注册简单事件
SimpleEventPlugin.registerEvents();

const listeningMarker = '_reactListening' + Math.random().toString(36).slice(2);

export function listenToAllSupportedEvents (rootContainerElement) {
  // 监听根容器，只监听一次
  if (!rootContainerElement[listeningMarker]) {
    // 遍历所有的原生事件，比如 click， 进行监听
    allNativeEvents.forEach((domEventName) => {
      listenToNativeEvents(domEventName, true, rootContainerElement);
      listenToNativeEvents(domEventName, false, rootContainerElement);
    })
  }
}

/**
 * 注册原生事件
 * @param {*} domEventName 原生事件
 * @param {*} isCapturePhaseListener 是否是捕获阶段
 * @param {*} target 目标 DOM 节点
 */
export function listenToNativeEvents (domEventName, isCapturePhaseListener, target) {
  let eventSystemFlags = 0;
  if (isCapturePhaseListener) {
    eventSystemFlags |= IS_CAPTURE_PHASE;
  }

  addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener)
}


function addTrappedEventListener (targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
  const listener = createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags);
  if (isCapturePhaseListener) {
    addEventCaptureListener(targetContainer, domEventName, listener);
  } else {
    addEventBubbleListener(targetContainer, domEventName, listener);
  }
}

export function dispatchEventForPluginEventSystem (
  domEventName,
  eventSystemFlags,
  nativeEvent,
  targetInst,
  targetContainer
) {
  dispatchEventForPlugins(
    domEventName,
    eventSystemFlags,
    nativeEvent,
    targetInst,
    targetContainer
  )
}

function dispatchEventForPlugins (
  domEventName,
  eventSystemFlags,
  nativeEvent,
  targetInst,
  targetContainer
) {
  const nativeEventTarget = getEventTarget(nativeEvent);
  // 派发事件的数组
  const dispatchQueue = [];

  SimpleEventPlugin.extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer
  );
  // console.log('dispatchQueue', dispatchQueue)

  processDispatchQueue(dispatchQueue, eventSystemFlags);
}

function processDispatchQueue (dispatchQueue, eventSystemFlags) {
  const isCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) != 0;
  for (let i = 0; i < dispatchQueue.length; i++) {
    const { listeners, event } = dispatchQueue[i];
    processDispatchQueueItemsOrder(event, listeners, isCapturePhase)
  }
}

function processDispatchQueueItemsOrder (event, dispatchListeners, isCapturePhase) {
  // 捕获
  if (isCapturePhase) {
    for (let i = dispatchListeners.length - 1; i >= 0; i--) {
      const { listener, currentTarget } = dispatchListeners[i];
      if (event.isPropagationtopped()) {
        return;
      }
      exectueDispatch(event, listener, currentTarget);
    }
  } else {
    for (let i = 0; i < dispatchListeners.length; i++) {
      const { listener, currentTarget } = dispatchListeners[i];
      if (event.isPropagationtopped()) {
        return;
      }
      exectueDispatch(event, listener, currentTarget);
    }
  }
}

function exectueDispatch (event, listener, currentTarget) {
  event.currentTarget = currentTarget;
  listener(event);
}

/**
 * 收集单个阶段事件，span -> h1 -> 捕获阶段/冒泡阶段
 * @param {*} targetFiber 
 * @param {*} reactName 
 * @param {*} nativeEventType 
 * @param {*} isCapturePhase 
 * @returns 
 */
export function accumulateSinglePhaseListeners (targetFiber, reactName, nativeEventType, isCapturePhase) {
  const captureName = reactName + "Capture";
  const reactEventName = isCapturePhase ? captureName : reactName;
  const listeners = [];
  let instance = targetFiber;
  while (instance !== null) {
    const { stateNode, tag } = instance;
    if (tag === HostComponent && stateNode !== null) {
      const listener = getListener(instance, reactEventName);
      if (listener) {
        listeners.push(createDispatchListener(instance, listener, stateNode));
      }
    }
    instance = instance.return;
  }

  return listeners;
}

function createDispatchListener (instance, listener, currentTarget) {
  return {
    instance,
    listener,
    currentTarget,
  }
}