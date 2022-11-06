import React, { useReducer, useCallback } from 'react';
import CacheContext from './cacheContext';
import cacheReducer from './cacheReducer';
import * as cacheTypes from './cache.type';

type KeepAliveProviderProps = React.PropsWithChildren<{}>

const KeepAliveProvider: React.FC<KeepAliveProviderProps> = (props): JSX.Element => {
  const [cacheStates, dispatch] = useReducer(cacheReducer, {});

  const mount = useCallback(({ cacheId, reactElement }) => {
    if (!cacheStates[cacheId]) {
      dispatch({
        type: cacheTypes.CREATE,
        payload: {
          cacheId,
          reactElement
        }
      });
    }
  }, [cacheStates]);

  return (
    <CacheContext.Provider value={{ cacheStates, dispatch, mount }}>
      {props.children}
      {
        Object.values(cacheStates).map(({ cacheId, reactElement }, x: number) => (
          <div
            id={`KeepAliveProvider_${cacheId}`}
            key={x}
            ref={(divDom) => {
              const cacheState = cacheStates[cacheId];
              if (divDom && (!cacheState.doms)) {
                const doms = Array.from(divDom.childNodes);
                dispatch({
                  type: cacheTypes.CREATED,
                  payload: {
                    cacheId,
                    doms
                  }
                })
              }
            }}
          >
            {reactElement}
          </div>
        ))
      }
    </CacheContext.Provider>
  )
}

export default KeepAliveProvider;