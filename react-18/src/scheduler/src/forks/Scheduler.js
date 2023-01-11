/**
 * 优先队列
 * @param {*} callback 
 */
export function scheduleCallback (callback) {
  requestIdleCallback(callback);
}