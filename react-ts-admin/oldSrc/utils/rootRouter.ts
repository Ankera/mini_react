import { LocalComponentKeyValue } from '../default.interface';
import { StandalonePagesConfigProp } from '../layout/layout.interface';

/**
 * 给本地开发添加一个标识
 * @param rc
 * @returns
 */
export const switchRouterConfig = (rc: LocalComponentKeyValue): LocalComponentKeyValue => {
  if (typeof rc === 'object' && rc) {
    const newRc: LocalComponentKeyValue = {};
    const keys = Object.keys(rc);
    keys.forEach((item: string) => {
      newRc[item] = {
        ...rc[item],
        isLocalDevelopment: true,
      };
    });

    return newRc;
  }
  return rc;
};

/**
 * 本地独立页开发
 * @param rc
 * @returns
 */
export const switchStandAloneRouterConfig = (rc: (LocalComponentKeyValue | StandalonePagesConfigProp)): StandalonePagesConfigProp[] => {
  if (typeof rc === 'object' && rc) {
    const newRc: StandalonePagesConfigProp[] = [];
    const keys = Object.keys(rc);
    keys.forEach((item: string) => {
      if (rc[item] && rc[item].moduleId) {
        newRc.push({
          ...rc[item],
          path: item,
          isLocalDevelopment: true,
        });
      }
    });

    return newRc;
  }
  return rc;
};

/**
 * 是否本地开发
 * @param rc
 * @returns
 */
export const isLocalDevelopment = (rc: LocalComponentKeyValue): boolean => {
  if (typeof rc === 'object' && rc) {
    const keys = Object.keys(rc);
    return keys.length > 0;
  }
  return false;
};