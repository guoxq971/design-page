import { TOKEN } from '@/designApplication/mock/config';
import { SubmitParamType } from '@/designApplication/interface_2/params';

/**
 * 收藏产品
 * @param {SubmitParamType} param
 * @returns {Promise<import('@/design').SaveProdResponse>}
 * */
export function fetchSaveProd(param) {
  // const domain = 'http://gateway.testcustomwe.com';
  const domain = 'http://192.168.2.50:8680';
  const URL = '/designer-web/CMProductAct/saveProduct.act';

  const body = JSON.stringify(param);
  return fetch(`${domain}${URL}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      'content-type': 'application/json; charset=UTF-8',
      ssotoken: TOKEN,
    },
    referrer: 'http://devfront.testcustomwe.com:8081/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: body,
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
