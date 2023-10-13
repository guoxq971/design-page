import { TOKEN } from '@/designApplication/mock/config';

export function fetchProd3dConfigByRefineList(templateNo) {
  return fetch('http://gateway.testcustomwe.com/base-web/cm/cmProductTemplate/getSizeListByTemplateNo/' + templateNo, {
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
