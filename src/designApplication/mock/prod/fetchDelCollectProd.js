import { TOKEN } from '@/designApplication/mock/config';

/**
 * 取消收藏产品
 * @returns {Promise<import('@/design').ResponseData<null>>}
 * */
export function fetchDelCollectProd(collectId) {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/cm/cmProductTemplateCollect/delete/' + collectId;
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
    body: '{"collectId":"' + collectId + '"}',
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
