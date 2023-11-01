import { TOKEN } from '@/designApplication/mock/config';

/**
 * 设计图收藏 - 背景图
 * @param {string} imgId
 * @returns {Promise<import('@/design').ResponseDataOld>} 子账号列表
 * */
export async function fetchCollectImageBg(imgId) {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/CMDesignImageQuickAct/saveQuickDesignImage.act?imgId=' + imgId;
  return fetch(`${domain}${URL}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      ssotoken: TOKEN,
    },
    referrer: 'http://devfront.testcustomwe.com:8081/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
