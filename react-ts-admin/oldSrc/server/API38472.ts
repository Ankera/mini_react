import Request, { YWRequestConfig } from '@ywfe/request';
import { getHost, reduceParams, querystring } from '../utils';

const { basePath = '', loginPath = '' } = getHost('PROAUTH', '88');

interface API38472Item {

  /** 模块id */
  moduleId?: string;

  /** 模块名称 */
  moduleName?: string;

  /** 菜单列表 ,ResourceMenuDto */
  menuResourceList?: API38472Item[];

  /** 其他资源列表 ,ResourceMenuDto */
  otherResourceList?: API38472Item[];

  /** 导航栏展示类型 */
  showType?: string;

}

interface API38472Res {
  /** T  */
  list?: API38472Item[];
  /** 云分类id  */
  cloudCategoryId?: string;

}

export const fetchAPI38472Data = async (inputs: any, config?: YWRequestConfig): Promise<API38472Res> => {
  const params = reduceParams(inputs);

  const res: API38472Res = await Request.get(`${basePath}/ywwl-admin/desktop/resource/list/cloud/modules?${querystring(params)}`, {
    loginHost: loginPath,
    ...config,
  });

  return res;
};
