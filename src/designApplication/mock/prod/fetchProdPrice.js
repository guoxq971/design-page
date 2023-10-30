import { TOKEN } from '@/designApplication/mock/config';
import { fetchProdPriceMock } from '@/designApplication/mock/prod/fetchProdPriceMock';

/**
 * 获取产品价格-根据模板号
 * @param {string} templateNo
 * @returns {Promise<import('@/design').ProdPriceResponse>}
 */
export function fetchProdPrice(templateNo) {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/CMDesignerAct/listTemplatePrice?templateNo=' + templateNo;
  // ?templateNo=2385

  return fetch(`${domain}${URL}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      ssotoken: TOKEN,
    },
    referrer: 'http://devfront.testcustomwe.com:8081/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
