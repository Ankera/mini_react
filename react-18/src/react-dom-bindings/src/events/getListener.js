import { getFiberCurrentPropsFromNode } from '../client/ReactDOMComponentTree';
/**
 * 获取fiber上的回调函数
 * @param {*} inst 
 * @param {*} registerationName 
 */
function getListener (inst, registerationName) {
  const { stateNode } = inst;
  if (stateNode === null) {
    return null;
  }
  const props = getFiberCurrentPropsFromNode(stateNode);
  if (props === null) {
    return null;
  }
  const listener = props[registerationName];
  return listener;
}

export default getListener;