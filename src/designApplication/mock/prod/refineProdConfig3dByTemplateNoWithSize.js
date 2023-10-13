import { TOKEN } from '@/designApplication/mock/config';

/**
 * 获取精细产品的3d配置数据-根据模板编号和尺码
 * @param {string} templateNo 模板编号
 * @param {string} size 尺码 (S,M,L,XL,XXL)
 * @returns {Promise<ProdItemDetail>} 产品详情数据
 * */
export function fetchRefineProdConfig3dByTemplateNoWithSize(templateNo, size) {
  return fetch(`http://gateway.testcustomwe.com/base-web/template/cmProductTemplateConfig/get3dConfig/${templateNo}/${size}?templateNo=${templateNo}&size=${size}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      ssotoken: TOKEN,
    },
    referrer: 'http://front.testcustomwe.com/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.json());
}
