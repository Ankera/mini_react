import Request, { YWRequestConfig } from '@ywfe/request';
import { getHost } from '../utils';

const { basePath = '', loginPath = '' } = getHost('PROAUTH', '88');

interface API38465Item {

  /** 业务id */
  cloudCategoryId?: string;

  /** 业务平台名称 */
  cloudCategoryName?: string;

  /** 云描述 */
  cloudCategoryRemark?: string;

  /**  */
  icon?: string;

}

interface API38465Res {
  /** T  */
  list?: API38465Item[];

}

export const fetchAPI38465Data = async (config?: YWRequestConfig): Promise<API38465Res> => {
  const res: API38465Res = await Request.get(`${basePath}/ywwl-admin/desktop/resource/list/categories`, {
    loginHost: loginPath,
    ...config,
  });

  return res;
};
