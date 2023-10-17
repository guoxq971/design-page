import { TOKEN } from '@/designApplication/mock/config';
import { fetchAdminImageListMock } from '@/designApplication/mock/image/fetchAdminImageListMock';

/**
 * 获取管理员图库列表
 * @param {Object} params 参数
 * @returns {Promise<fetchAdminImageListMock>} 管理员图库列表
 * */
export async function fetchAdminImageList(params) {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = `/basic-web/cm/cmDesignImage/admin/designerSelectPage/${params.pageNum}/${params.pageSize}`;
  return fetch(`${domain}${URL}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'content-type': 'application/json; charset=UTF-8',
      ssotoken: TOKEN,
    },
    referrer: 'http://front.testcustomwe.com/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    // body: '{"query":"","queryinput":"","imageType":"","adminType":"","copyright":"","isAll":"","total":3,"pageNum":1,"pageSize":24,"offset":0,"sortMode":"1"}',
    body: JSON.stringify(params),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
