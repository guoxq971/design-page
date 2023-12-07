import { TOKEN } from '@/designApplication/mock/config';

/**
 * 保存快捷键
 * @returns {Promise<any>}
 * */
export function fetchSaveHotkeys(obj) {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/CMQuickKeyAct/saveCustomKeySetNew';
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
    body: JSON.stringify({ customKeyNew: JSON.stringify(obj) }),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
