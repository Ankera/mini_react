import Request, { YWRequestConfig } from '@ywfe/request';
import { getHost } from '../utils';

const { basePath = '', loginPath = '' } = getHost('PROAUTH', '88');

export interface API25815Res {
  /** 用户id  */
  userId?: string;
  /** 用户的钉钉userId  */
  dingdingUserId?: string;
  /** 钉钉用户的头像地址  */
  dingdingHeadIconUrl?: string;
  /** 用户名称  */
  userName?: string;
  /** 用户手机号  */
  userPhone?: string;
  /** 备注  */
  remark?: string;
  /** 邮箱地址  */
  userEmail?: string;
  /** DISABLE NORMAL  */
  status?: string;
  /** 部门id  */
  orgId?: string;
  /** 所属部门名称  */
  orgName?: string;
  /** 所属部门全称  */
  orgFullName?: string;
  /** 是否灰度用户  */
  beta?: boolean;
  /** 是否切换新平台  */
  isNewPlatform?: boolean;

}

export const fetchAPI25815Data = async (config?: YWRequestConfig): Promise<API25815Res> => {
  const res: API25815Res = await Request.get(`${basePath}/ywwl-admin/user/current/info`, {
    loginHost: loginPath,
    ...config,
  });

  return res;
};
