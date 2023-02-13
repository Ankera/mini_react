import ReactCurrentDispatcher from './ReactCurrentDispatcher';

function resolveDispatcher () {
  return ReactCurrentDispatcher.current;
}

/**
 * 
 * @param {*} reducer 处理函数， 用于处理老状态，计算新状态
 * @param {*} initialArg 初始值
 */
export function useReducer (reducer, initialArg) {
  const dispatcher = resolveDispatcher();

  return dispatcher.useReducer(reducer, initialArg);
}