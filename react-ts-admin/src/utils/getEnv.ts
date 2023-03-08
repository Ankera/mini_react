/**
 * 通过域名获取当前环境
 * @returns
 */
export const getEnv = (): string => {
  return window.localStorage.getItem('env') || 'prod';
};

interface ReturnHost {
  basePath: string;
  loginPath: string;
}

export const getHost = (projectId: string, yapiProjectid: string): ReturnHost => {
  const configs = (window as any).configs ? (window as any).configs : {};
  const env = getEnv();
  const basePath = configs[projectId]
    ? `${configs[projectId][env].API_BASE_URL
    }${env === 'mock' ? `/${yapiProjectid}` : ''}`
    : '';
  const loginPath = configs.AUTH ? configs.AUTH[env].APPLICATION_URL : '';
  return {
    basePath: 'https://test-gateway.ywwl.com',
    loginPath,
  };
};
