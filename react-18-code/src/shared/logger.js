import * as ReactWorkTags from 'react-reconciler/src/ReactWorkTags';

const ReactWorkTagsMap = new Map();

for (const tag in ReactWorkTags) {
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

  // console.log(str);
  return str;
}

let indent = {
  number: 0
}

export { indent }