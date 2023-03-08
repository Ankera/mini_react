export const getQueryString = (name: string): string => {
  const url = window.location.href;
  const reg = new RegExp(`(\\?|&)${name}=([^&]*)(&|$)`, 'i');
  const r = url.match(reg);

  if (r !== null) {
    return unescape(r[2]);
  }
  return '';
};
