import * as R from 'ramda';

export const trimAll = <T extends string | string[]>(data: T): T => {
  if (R.isNil(data) || R.isEmpty(data)) {
    return data;
  }
  const type = R.type(data);
  switch (type) {
    case 'String': {
      return R.trim(data as string) as T;
    }
    case 'Array': {
      return R.filter(R.complement(R.isEmpty))(data as string[]) as T;
    }
    default: {
      return data;
    }
  }
};

export const split = (separator: string, data: string): string[] => {
  if (R.isEmpty(data) || R.isNil(data)) {
    return [];
  }
  return R.pipe(R.split(separator), trimAll)(data);
};

export const slicePath = (path: string, start = 0, end?: number) => {
  const paths = split('/', path);
  if (!end) {
    end = paths.length - 1;
  }
  const newPaths = paths.slice(start, end);
  return `/${newPaths.join('/')}`;
};
