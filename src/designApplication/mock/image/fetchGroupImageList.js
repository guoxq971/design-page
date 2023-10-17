import { TOKEN } from '@/designApplication/mock/config';
import { fetchGroupImageListMock } from '@/designApplication/mock/image/fetchGroupImageListMock';

/**
 * 获取列表 - 小组图库
 * @param {Object} params 参数
 * @returns {Promise<fetchGroupImageListMock>} 小组图库
 * */
export async function fetchGroupImageList(params = null) {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = `/base-web/CMProductTemplateAct/customDesignCategories.act`;

  return fetch(`${domain}${URL}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'content-type': 'application/json; charset=UTF-8',
      ssotoken: TOKEN,
    },
    referrer: 'http://front.testcustomwe.com/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    // "body": "{\"query\":\"\",\"customerId\":\"\",\"designerId\":\"\",\"typeId\":\"\",\"tort_type\":-1,\"isAll\":\"\",\"copyright\":\"\",\"quality\":\"\",\"imageType\":\"\",\"qty[from]\":\"\",\"qty[to]\":\"\",\"width[from]\":\"\",\"width[to]\":\"\",\"height[from]\":\"\",\"height[to]\":\"\",\"created[from]\":\"\",\"created[to]\":\"\",\"modified[from]\":\"\",\"modified[to]\":\"\",\"mediaType\":\"json\",\"gxtype1\":\"\",\"gxtype2\":\"\",\"gxsx\":0,\"templateNo\":\"\",\"orderImg\":\"\",\"gxcopyright\":\"\",\"gxImgQuality\":\"\",\"gxSearchText\":\"\",\"limit\":24,\"offset\":0,\"total\":4,\"pageNum\":1,\"pageSize\":24,\"queryAll\":1,\"seqId\":\"\",\"sortMode\":\"1\"}",
    body: params ? JSON.stringify(params) : '{}',
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
