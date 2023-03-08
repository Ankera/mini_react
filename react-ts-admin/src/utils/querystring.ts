import * as R from 'ramda';

export const querystring = (query: any): string => {
  if (R.isEmpty(query)) {
    return '';
  }
  const keys = Object.keys(query);
  let result = '';
  keys.map((key) => {
    result += `&${key}=${query[key]}`;
  });
  const params = new URLSearchParams(result);
  return params.toString() || '';
};
