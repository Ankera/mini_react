export const allNativeEvents = new Set();

/**
 * 注册两个阶段的事件
 * @param {*} registrationName react事件名 onClick
 * @param {*} dependencies 原生事件名 [click]
 */
export function registerTwoPhaseEvent (registrationName, dependencies) {
  // 冒泡
  registerDirectEvent(registrationName, dependencies);

  // 捕获
  registerDirectEvent(registrationName + 'Capture', dependencies);
}

function registerDirectEvent (registrationName, dependencies) {
  for (let i = 0; i < dependencies.length; i++) {
    allNativeEvents.add(dependencies[i]); // click
  }
}