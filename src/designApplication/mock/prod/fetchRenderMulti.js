import { TOKEN } from '@/designApplication/mock/config';
import { SubmitParamType } from '@/designApplication/interface_2/params';

/**
 * 渲染多角度
 * @param {SubmitParamType} param 参数
 * @returns {Promise<import('@/design').RenderMultiResponse>}
 * */
export function fetchRenderMulti(param) {
  const domain = 'http://192.168.2.50:8680';
  const URL = '/designer-web/CMDesignAct/realTimeCutMulti2.act?mediaType=json';
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
    credentials: 'omit',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
