import { TOKEN } from '@/designApplication/mock/config';
import { fetchCollectSelectListMock } from '@/designApplication/mock/prod/fetchCollectSelectListMock';

/**
 * 获取收藏产品的下拉列表
 * @returns {Promise<fetchCollectSelectListMock>} 收藏产品的下拉列表
 * */
export function fetchCollectSelectList() {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/CMProductTemplateMytypeAct/getTree4sjq.act';
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
