import { TOKEN } from '@/designApplication/mock/config';

/**
 * 根据模板号获取3d配置（通用模板）
 * @param templateNo
 * @returns {Promise<import('@/design').ProdConfig3dResponse>}
 */
export function fetchProd3dConfigByCommon(templateNo) {
  return fetch('http://gateway.testcustomwe.com/base-web/template/cmProductTemplateConfig/get3dConfig/' + templateNo + '?templateNo=' + templateNo, {
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
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
