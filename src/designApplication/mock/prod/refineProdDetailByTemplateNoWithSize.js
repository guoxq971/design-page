import { TOKEN } from '@/designApplication/mock/config';

/**
 * 获取精细产品的详情数据-根据模板编号和尺码
 * @param {string} templateNo 模板编号
 * @param {string} size 尺码 (S,M,L,XL,XXL)
 * @returns {Promise<ProdItemDetail>} 产品详情数据
 * */
export function fetchRefineProdDetailByTemplateNoWithSize(templateNo, size) {
  return fetch('http://gateway.testcustomwe.com/base-web/CMProductTemplateAct/selectTemplateList4DesignWithSize.act', {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'content-type': 'application/json; charset=UTF-8',
      ssotoken: TOKEN,
    },
    referrer: 'http://front.testcustomwe.com/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    // body: `{"templateNo":"2424","size":"S"}`,
    body: `{"templateNo":"${templateNo}","size":"${size}"}`,
    // body: JSON.stringify(`{ templateNo: ${templateNo}, size: ${size} }`),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  }).then((res) => res.json());
}
