import * as ReactWorkTags from 'react-reconciler/src/ReactWorkTags';

const ReactWorkTagsMap = new Map();

for (const tag in ReactWorkTagsMap) {
  ReactWorkTagsMap.set(ReactWorkTags[tag], tag);
}

export default function logger (prefix, workInProgress) {
  const tagValue = workInProgress.tag;
  const tagName = ReactWorkTagsMap.get(tagValue);
  let str = `${prefix} ${tagName}`;
  if (tagName === 'HostComponent') {
    str += ` ${workInProgress.type}`;
  } else if (tagName === 'HostText') {
    str += ` ${workInProgress.pendingProps}`;
  }

  return str;
}