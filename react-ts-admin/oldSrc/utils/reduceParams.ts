import * as R from 'ramda';

export const reduceParams = (data: any) => {
  if (!data) {
    return {};
  }
  if (data instanceof FormData) {
    return data;
  }
  const result = R.filter((item) => !R.isNil(item) && !R.isEmpty(item))(data) || {};
  return result as any;
};
