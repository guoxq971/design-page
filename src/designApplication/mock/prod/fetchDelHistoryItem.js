import { TOKEN } from '@/designApplication/mock/config';

/**
 * 删除历史记录
 * @params {string} seqIds
 * @returns {Promise<import('@/design').ResponseData<null>>}
 * */
export function fetchDelHistoryItem(seqIds) {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/CMProductAmazonAct/updateUserflagBatchBySeqIds.act';
  return fetch(`${domain}${URL}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      'content-type': 'application/json; charset=UTF-8',
      ssotoken: TOKEN,
    },
    referrer: 'http://devfront.testcustomwe.com:8080/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: '{"seqIds":"' + seqIds + '"}',
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
