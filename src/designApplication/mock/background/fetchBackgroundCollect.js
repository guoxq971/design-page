import { TOKEN } from '@/designApplication/mock/config';

/**
 * 获取列表 - 收藏背景
 * @returns {Promise<any>} 获取列表 - 背景图
 * */
export async function fetchBackgroundCollect() {
  const domain = 'http://gateway.testcustomwe.com';
  let URL = '/base-web/CMDesignImageQuickAct/queryQuickImageList.act';

  return fetch(`${domain}${URL}`, {
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
