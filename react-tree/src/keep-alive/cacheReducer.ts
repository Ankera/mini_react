import * as cacheTypes from './cache.type';

/**
 * 
 * @param state 
 * @param action 
 */
const cacheReducer = (cacheStates: Record<string, any>, action: any) => {
  const payload = action.payload;
  const cacheId = payload.cacheId;
  switch (action.type) {
    case cacheTypes.CREATE:
      return {
        ...cacheStates,
        [cacheId]: {
          cacheId,
          reactElement: payload.reactElement, // 渲染的虚拟dom
          status: cacheTypes.CREATE,
          doms: undefined, // 虚拟dom对应的真实dom
        }
      }
    case cacheTypes.CREATED:
      debugger
      return {
        ...cacheStates,
        [cacheId]: {
          ...cacheStates[cacheId],
          doms: payload.doms,
          status: cacheTypes.CREATED,
        }
      }
    case cacheTypes.ACTIVE:
      return {
        ...cacheStates,
      }
    default:
      return cacheStates;
  }
}

export default cacheReducer;