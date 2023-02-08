import { createContainer, updateContainer } from 'react-reconciler/src/ReactFiberReconciler';
import { listenToAllSupportedEvents } from 'react-dom-bindings/src/events/DOMPluginEventSystem';

function ReactDOMRoot (internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;

  // 临时清空
  root.containerInfo.innerHTML = ''

  updateContainer(children, root);
}

/**
 * div#root
 * @param {*} container 
 */
export function createRoot (container) {
  // debugger;
  const root = createContainer(container);

  listenToAllSupportedEvents(container);

  return new ReactDOMRoot(root);
}

