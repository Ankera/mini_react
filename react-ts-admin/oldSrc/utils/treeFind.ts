import * as R from 'ramda';

interface Target {
  key: string;
  value?: any;
}

type BaseT = Record<string, any>;

export const treeFind = <T extends BaseT>(
  target: Target,
  childKey: string | null,
  data: Record<string, T>,
): any[] => {
  const hasChildren = (node: T) => childKey && R.hasPath([childKey], node) && !R.isEmpty(node[childKey]);
  const Tree: any = {
    reduce: R.curry((fn: any, init: any[], node: T) => {
      const acc = fn(init, node);

      if (!hasChildren(node) && node[target.key] === target.value) {
        return acc;
      }
      return childKey && node[childKey] && !R.isEmpty(node[childKey]) ? Tree.reduce(findFn, acc)(node[childKey]) : acc;
    }),
    find: R.curry((fn: any, init: any[], node: T[]) => R.pipe(
      R.map(Tree.reduce(fn, init)),
      R.flatten,
      R.union(init),
    )(node)),
  };
  const reducerFn = (arr: any[], data: T) => {
    if (
      (target.value && data[target.key] && data[target.key] === target.value)
      || (!target.value && data[target.key])
    ) {
      return childKey ? arr.concat([R.omit([childKey], data)]) : arr.concat([data]);
    }
    return arr;
  };

  const findFn = (arr: any[], data: Record<string, T>) => {
    const keys = Object.keys(data);
    const result: any = [];
    keys.map((key: string) => {
      result.push(data[key]);
    });
    return Tree.find(reducerFn, arr)(result);
  };

  const type = R.type(data);
  switch (type) {
    case 'Object': {
      return Tree.reduce(findFn, [])(data);
    }
    case 'Array': {
      return Tree.find(reducerFn, [])(data);
    }
    default: {
      return [];
    }
  }
};
