import { TOKEN } from '@/designApplication/mock/config';

/**
 * 取消收藏设计图
 * @param {string} seqId
 * @returns {Promise<import('@/design').ResponseDataOld>} 子账号列表
 * */
export async function fetchDelCollectImage(seqId) {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/CMDesignImageQuickAct/deleteImage.act?seqId=' + seqId;
  return fetch(`${domain}${URL}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      ssotoken: TOKEN,
    },
    referrer: 'http://devfront.testcustomwe.com:8081/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: '{"seqId":"' + seqId + '"}',
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
