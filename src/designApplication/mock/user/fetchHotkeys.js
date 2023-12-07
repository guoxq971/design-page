import { TOKEN } from '@/designApplication/mock/config';

/**
 * 快捷键列表
 * @returns {Promise<any>} 快捷键列表
 * */
export function fetchHotkeys() {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/CMQuickKeyAct/getCustomKeySetNew';
  return fetch(`${domain}${URL}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      ssotoken: TOKEN,
    },
    referrer: 'http://devfront.testcustomwe.com:8081/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
