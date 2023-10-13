import { TOKEN } from '@/designApplication/mock/config';

// 通用产品-分类下拉列表
export function fetchProdCategoryList(params = null) {
  return fetch('http://gateway.testcustomwe.com/base-web/CMProductTemplateTypeAct/productTypeDepartments.act', {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      [TOKEN]: TOKEN,
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
