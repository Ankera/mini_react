
import { registerTwoPhaseEvent } from './EventRegistry';

const simpleEventPluginEvents = ['click', 'drag'];

export const topLevelEventsToReactNames = new Map();

function registerSimpleEvent (domEventName, reactName) {
  registerTwoPhaseEvent(reactName, [domEventName]);

  // 把原生事件名和处理函数的名字进行绑定，click => onClick
  topLevelEventsToReactNames.set(domEventName, reactName);
}

export function registerSimpleEvents () {
  for (let i = 0; i < simpleEventPluginEvents.length; i++) {
    const eventName = simpleEventPluginEvents[i];
    const domEventName = eventName.toLowerCase();
    const capitalEventName = eventName[0].toUpperCase() + eventName.slice(1);

    registerSimpleEvent(domEventName, `on${capitalEventName}`);
  }
}