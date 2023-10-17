import { TOKEN } from '@/designApplication/mock/config';
import { FetchImageCategoryByShareMock, FetchImageCategoryByShareOfTwoMock } from '@/designApplication/mock/image/fetchImageCategoryByShareMock';

/**
 * 获取图片分类 - 共享
 * @returns {Promise<FetchImageCategoryByShareMock>} 子账号列表
 * */
export async function fetchImageCategoryByShare() {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/CMDesignImageGxtypeAct/selectTypeFirst.act';
  const url = `${domain}${URL}`;
  return fetch(url, {
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

/**
 * 获取图片分类 - 共享 - 二级
 * @param {string} parentId 父级id
 * @returns {Promise<FetchImageCategoryByShareOfTwoMock>} 子账号列表
 * */
export async function fetchImageCategoryByShareOfTwo(parentId) {
  const domain = 'http://gateway.testcustomwe.com';
  let URL = '/base-web/CMDesignImageGxtypeAct/getListByParentCode.act';
  URL += `?parentId=${parentId}`;
  const url = `${domain}${URL}`;
  return fetch(url, {
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
