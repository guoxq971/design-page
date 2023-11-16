import { TOKEN } from '@/designApplication/mock/config';

/**
 * 上传设计图 - 确认接口
 * @param {import('@/design').UploadImageCheckParams} param 参数
 * @returns {Promise<import('@/design').UploadImageCheckResponse>}
 * */
export async function fetchUploadImageCheck(param) {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/CMDesignImageAct/ajaxSaveBatchDesign.act?usertype=1';
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
