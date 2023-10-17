import { TOKEN } from '@/designApplication/mock/config';
import { fetchAccountListMock } from '@/designApplication/mock/image/fetchAccountListMock';

/**
 * 获取子账号列表
 * @returns {Promise<fetchAccountListMock>} 子账号列表
 * */
export async function fetchAccountList() {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/YZAccountAct/getAccountList4Designer';
  return fetch(`${domain}${URL}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      ssotoken: TOKEN,
    },
    referrer: 'http://front.testcustomwe.com/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
