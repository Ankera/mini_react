import Request, { YWRequestConfig } from '@ywfe/request';
import { getHost, reduceParams, querystring } from '../utils';

const { basePath = '', loginPath = '' } = getHost('PROAUTH', '88');

export interface API44997Res {
  /**   */
  result?: boolean;

}

export const fetchAPI44997Data = async (inputs: any, config?: YWRequestConfig): Promise<API44997Res> => {
  const params = reduceParams(inputs);

  const res: API44997Res = await Request.get(`${basePath}/ywwl-admin/new/resource/checkPathDataPermission?${querystring(params)}`, {
    loginHost: loginPath,
    ...config,
  });

  return res;
};
