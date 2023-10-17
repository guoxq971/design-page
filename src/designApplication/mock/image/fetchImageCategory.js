import { TOKEN } from '@/designApplication/mock/config';
import { fetchImageCategoryMock } from '@/designApplication/mock/image/fetchImageCategoryMock';

/**
 * 获取图片分类
 * @returns {Promise<fetchImageCategoryMock>} 子账号列表
 * */
export async function fetchImageCategory() {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/CMDesignImageTypeAct/getImageType.act';
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
