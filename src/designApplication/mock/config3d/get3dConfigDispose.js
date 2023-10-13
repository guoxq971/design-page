import { get3dConfig } from '@/designApplication/mock/config3d/get3dConfig';
import { Message } from 'element-ui';
import { Config3d } from '@/designApplication/interface/config3d';

/**
 * 解析产品的3d配置-通用产品
 * @param {string} templateNo 模板编号
 * @returns {Promise<Config3d>} 3d配置
 * */
export function parse3dConfigByCommon(templateNo) {
  if (![2424].includes(+templateNo)) {
    Message.warning('获取3d配置失败, 只支持 2424 模板');
    return Promise.resolve(null);
  }
  const result = get3dConfig; //接口数据
  if (result.code !== 0) {
    Message.warning('获取3d配置失败');
    return Promise.resolve(null);
  }
  const data = result.data;
  const config3d = new Config3d();
  Object.assign(config3d, data);
  return Promise.resolve(config3d);
}
