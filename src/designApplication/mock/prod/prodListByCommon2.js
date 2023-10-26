import { TOKEN } from '@/designApplication/mock/config';

/**
 * 获取通用产品列表
 * @param {import('@/design').ProdListParams} params
 * @returns {Promise<import('@/design').ProdListResponseData>}
 */
export function fetchProdListByCommon(params) {
  let str = '';
  // 对象转请求字符串
  for (let key in params) {
    const value = params[key] === undefined ? '' : params[key];
    str += `${key}=${value}&`;
  }
  str = str.slice(0, -1);
  return fetch('http://gateway.testcustomwe.com/base-web/CMProductTemplateAct/selectTemplateList4Design.act?' + str, {
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
