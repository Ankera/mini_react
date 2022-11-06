import React, { useRef, useContext, useEffect } from 'react';
import CacheContext from './cacheContext';

const withKeepAlive = (OldComponent: React.FC | React.ComponentClass, { cacheId = window.location.pathname }) => {
  return (props: any) => {
    const divRef = useRef<HTMLDivElement>(null);
    const { cacheStates, dispatch, mount } = useContext<any>(CacheContext);

    useEffect(() => {
      const cacheState = cacheStates[cacheId];
      if (cacheState && cacheState.doms) {
        const doms = cacheState.doms;
        doms.forEach((dom: HTMLElement) => {
          divRef.current?.appendChild(dom);
        })
      } else {
        mount({
          cacheId,
          reactElement: <OldComponent {...props} />
        });
      }

    }, [cacheStates, mount, props])

    return (
      <div ref={divRef} id={`withKeepAlive_${cacheId}`}></div>
    )
  }
}

export default withKeepAlive;