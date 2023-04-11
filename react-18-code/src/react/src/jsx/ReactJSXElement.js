import hasOwnProperty from 'shared/hasOwnProperty';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';

/**
 * 保留的属性
 */
const RESERVED_PORPS = {
  key: true,
  ref: true,
  _self: true,
  _source: true,
}

function hasValidRef (config) {
  return config.ref !== undefined;
}

function ReactElement (type, key, ref, props) {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props
  }
}

export function jsxDEV (type, config, maybeKey) {
  // debugger;
  // 属性名
  let propName;
  const props = {};
  let key = null;
  let ref = null;

  if (typeof maybeKey !== 'undefined') {
    key = maybeKey;
  }

  if (hasValidRef(config)) {
    ref = config.ref;
  }

  for (propName in config) {
    if (hasOwnProperty.call(config, propName) && !RESERVED_PORPS.hasOwnProperty(propName)) {
      props[propName] = config[propName];
    }
  }

  return ReactElement(type, key, ref, props);
}