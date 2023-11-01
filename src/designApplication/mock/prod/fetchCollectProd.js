import { TOKEN } from '@/designApplication/mock/config';

/**
 * 收藏产品
 * @returns {Promise<import('@/design').ResponseData<null>>}
 * */
export function fetchCollectProd(templateId) {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/cm/cmProductTemplateCollect/save';
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
    body: '{"templateId":"' + templateId + '"}',
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
