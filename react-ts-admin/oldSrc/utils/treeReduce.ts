import * as R from 'ramda';

interface Target {
  key: string;
  value?: any;
}

type BaseT = Record<string, any>;

export const treeReduce = <T extends BaseT>(
  target: Target,
  childKey: string,
  data: T[] | T,
): any[] => {
  const hasChildren = (node: T) => R.hasPath([childKey], node);
  const Tree: any = {
    reduce: R.curry((reducerFn: any, init: any[], node: T) => {
      const acc = reducerFn(init, node);
      if (!hasChildren(node)) {
        return acc;
      }
      return node[childKey]
        ? node[childKey].reduce(Tree.reduce(reducerFn), acc)
        : acc;
    }),
    find: R.curry((findFn: any, init: any[], node: T[]) => R.pipe(R.map(Tree.reduce(findFn, init)), R.flatten)(node)),
  };
  const fn = (arr: any[], data: T) => {
    if (
      (target.value && data[target.key] && data[target.key] === target.value)
      || (!target.value && data[target.key])
    ) {
      return arr.concat([R.omit([childKey], data)]);
    }
    return arr;
  };

  const type = R.type(data);
  switch (type) {
    case 'Object': {
      return Tree.reduce(fn, [])(data);
    }
    case 'Array': {
      return Tree.find(fn, [])(data);
    }
    default: {
      return data as T[];
    }
  }
};
