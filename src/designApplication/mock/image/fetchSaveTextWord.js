import { TOKEN } from '@/designApplication/mock/config';

/**
 * 保存设计图参数信息
 * @returns {Promise<import('@/design').ResponseData<any>>}
 * */
export async function fetchSaveTextWord(param) {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/cm/cmProductWord/save';
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
    body: JSON.stringify(param),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
