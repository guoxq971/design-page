import { TOKEN } from '@/designApplication/mock/config';

/**
 * 收藏产品
 * @returns {Promise<import('@/design').HistoryListResponse>}
 * */
export function fetchHistoryList() {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/CMProductAct/productsHis.act';
  return fetch(`${domain}${URL}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      ssotoken: TOKEN,
    },
    referrer: 'http://devfront.testcustomwe.com:8080/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
