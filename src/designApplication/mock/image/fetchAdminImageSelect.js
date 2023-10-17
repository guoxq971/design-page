import { TOKEN } from '@/designApplication/mock/config';
import { fetchAdminImageSelectMock } from '@/designApplication/mock/image/fetchAdminImageSelectMock';

/**
 * 获取管理员图库 - 下拉列表
 * @param {Object} params 参数
 * @returns {Promise<fetchAdminImageSelectMock>} 下拉列表
 * */
export async function fetchAdminImageSelect(params) {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = `/basic-web/cm/cmDesignImageAdminType/tree/sublist`;
  return fetch(`${domain}${URL}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'content-type': 'application/json; charset=UTF-8',
      ssotoken: TOKEN,
    },
    referrer: 'http://front.testcustomwe.com/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    // "body": "{\"parentId\":0,\"typeName\":\"\"}",
    body: JSON.stringify(params),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
