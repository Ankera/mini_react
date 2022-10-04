import { TAG_ROOT } from './contant';
import { scheduleRoot } from './schedule';

function render (element, container) {
  const rootFiber = {
    tag: TAG_ROOT,
    stateNode: container,
    props: {
      children: [element]
    }
  }

  console.log('element', element);

  scheduleRoot(rootFiber);
}

const ReactDOM = {
  render
}

export default ReactDOM;