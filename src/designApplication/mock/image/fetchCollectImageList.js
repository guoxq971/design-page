import { TOKEN } from '@/designApplication/mock/config';
import { fetchCollectImageListMock } from '@/designApplication/mock/image/fetchCollectImageListMock';
/**
 * 获取列表 - 收藏图片
 * @returns {Promise<fetchCollectImageListMock>} 收藏图片
 * */
export async function fetchCollectImageList() {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = `/base-web/CMDesignImageQuickAct/queryQuickImageListSJ.act`;
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
