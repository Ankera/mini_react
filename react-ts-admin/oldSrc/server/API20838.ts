import Request, { YWRequestConfig } from '@ywfe/request';
import { getHost, reduceParams, querystring } from '../utils';

const { basePath = '', loginPath = '' } = getHost('PROAUTH', '88');

interface API20838Item {

  /** 菜单id */
  resourceId?: string;

  /** 菜单名称 */
  resourceName?: string;

  /** 路径 */
  url?: string;

  /** 云桌面菜单标识 */
  nameEn?: string;

  /** 二级菜单数据 */
  childMenus?: API20838Item[];

}

interface API20838Res {
  /** 模块id  */
  moduleId?: string;
  /** 模块名称  */
  moduleName?: string;
  /** 模块标识  */
  moduleNameEn?: string;
  /** 模块描述  */
  moduleRemark?: string;
  /** 模块图标icon  */
  moduleIcon?: string;
  /** 云分类id  */
  cloudCategoryId?: string;
  /** 云分类名称  */
  cloudCategoryName?: string;
  /** 序号  */
  sort?: number;
  /** 菜单资源数量  */
  resourceNum?: number;
  /** 是否展示  */
  isShow?: boolean;
  /** 菜单集合 ,DesktopResourceVO  */
  resourceList?: API20838Item[];
  /** 模块类型：DEFAULT ONLINE TRAILER  */
  moduleType?: string;
  /** 预告文案  */
  trailerText?: string;
  /** 产品负责人id  */
  productUserId?: string;
  /** 产品负责人名称  */
  productUserName?: string;
  /** 是否开放模块权限  */
  isPublish?: boolean;
  /** moduleShowType  */
  moduleShowType?: string;

}

export const fetchAPI20838Data = async (inputs: any, config?: YWRequestConfig): Promise<API20838Res> => {
  const params = reduceParams(inputs);

  const res: API20838Res = await Request.get(`${basePath}/ywwl-admin/desktop/module/info?${querystring(params)}`, {
    loginHost: loginPath,
    ...config,
  });

  return res;
};
