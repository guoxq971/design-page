import { TOKEN } from '@/designApplication/mock/config';
import { fetchAccountListMock } from '@/designApplication/mock/image/fetchAccountListMock';

/**
 * 获取列表 - 背景图
 * @param {object} params 参数
 * @returns {Promise<any>} 获取列表 - 背景图
 * */
export async function fetchBackgroundImage(params) {
  const domain = 'http://gateway.testcustomwe.com';
  let URL = '/base-web/CMDesignImageAct/getBgDesignsList.act';

  let str = '';
  // 对象转请求字符串
  for (let key in params) {
    const value = params[key] === undefined ? '' : params[key];
    str += `${key}=${value}&`;
  }
  str = str.slice(0, -1);

  URL = URL + '?' + str;

  // 替换 [ ]
  URL = URL.replace(/\[/g, '%5B').replace(/\]/g, '%5D');

  const url2 =
    'http://gateway.testcustomwe.com/base-web/CMDesignImageAct/getBgDesignsList.act?query=&customerId=&designerId=&typeId=&tort_type=-1&isAll=&copyright=&quality=&imageType=&qty%5Bfrom%5D=&qty%5Bto%5D=&width%5Bfrom%5D=&width%5Bto%5D=&height%5Bfrom%5D=&height%5Bto%5D=&created%5Bfrom%5D=&created%5Bto%5D=&modified%5Bfrom%5D=&modified%5Bto%5D=&mediaType=json&gxtype1=&gxtype2=&gxsx=&templateNo=&orderImg=&gxcopyright=&gxImgQuality=&gxSearchText=&limit=24&offset=&total=117&pageNum=1&pageSize=24&queryAll=1&seqId=&sortMode=1&';

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
