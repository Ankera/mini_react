/**
 * 向最小堆添加一个节点
 * @param {*} heap 
 * @param {*} node 
 */
export function push (heap, node) {
  const index = heap.length;

  heap.push(node);

  siftUp(heap, node, index);
}

/**
 * 查看最小对顶元素
 * @param {*} heap 
 */
export function peek (heap) {
  const first = heap[0];
  return first === undefined ? null : first;
}

/**
 * 弹出最小堆的堆顶元素
 * @param {*} heap 
 */
export function pop (heap) {
  const first = heap[0];
  if (first !== undefined) {
    const last = heap.pop();
    if (first !== last) {
      heap[0] = last;
      siftDown(heap, last, 0);
    }
    return first;
  } else {
    return null;
  }
}

/**
 * 向上调整一个节点，使其位于正确的位置
 * @param {*} heap 
 * @param {*} node 
 * @param {*} i 
 */
function siftUp (heap, node, i) {
  let index = i;
  while (true) {
    const parentIndex = index - 1 >>> 1;

    const parent = node[parentIndex];

    if (parent !== undefined && compare(parent, node) > 0) {
      // 把儿子的索引给父索引
      heap[parentIndex] = node;
      // 把父亲的值给子索引
      heap[index] = parent;
      index = parentIndex;
    } else {
      return;
    }
  }
}


/**
 * 向下调整一个节点，使其位于正确的位置
 * @param {*} heap 
 * @param {*} node 
 * @param {*} i 
 */
function siftDown (heap, node, i) {
  let index = i;
  const length = heap.length;
  while (index < length) {
    const leftIndex = (index + 1) * 2 - 1;
    const rightIndex = leftIndex + 1;
    const left = heap[leftIndex];
    const right = heap[rightIndex];
    // 如果左子节点存在，并且左子节点比父节点小
    if (left !== undefined && compare(left, node) < 0) {
      if (right !== undefined && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (right !== undefined && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      return;
    }
  }
}

function compare (a, b) {
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}


// let heap = [];

// let id = 1;
// push(heap, { sortIndex: 1, id: id++ });
// push(heap, { sortIndex: 2, id: id++ });
// push(heap, { sortIndex: 3, id: id++ });
// console.log(peak(heap));
// push(heap, { sortIndex: 4, id: id++ });
// push(heap, { sortIndex: 5, id: id++ });
// push(heap, { sortIndex: 6, id: id++ });
// push(heap, { sortIndex: 7, id: id++ });
// console.log(peak(heap));
// pop(heap);
// console.log(peak(heap));
