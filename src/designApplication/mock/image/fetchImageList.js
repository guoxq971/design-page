import { TOKEN } from '@/designApplication/mock/config';

/**
 * 获取设计图列表
 * @param {ImageListParams} _params 参数
 * @returns {Promise<Object>} 设计图列表
 * */
export async function fetchImageList(_params) {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/CMDesignImageAct/getDesignImageList.act';
  // let paramStr =
  //   'query=&customerId=&designerId=&typeId=&tort_type=-1&isAll=&copyright=&quality=&imageType=&qty%5Bfrom%5D=&qty%5Bto%5D=&width%5Bfrom%5D=&width%5Bto%5D=&height%5Bfrom%5D=&height%5Bto%5D=&created%5Bfrom%5D=&created%5Bto%5D=&modified%5Bfrom%5D=&modified%5Bto%5D=&mediaType=json&gxtype1=&gxtype2=&gxsx=&templateNo=2424&orderImg=&gxcopyright=&gxImgQuality=&gxSearchText=&limit=24&offset=&total=417&pageNum=1&pageSize=24&sortMode=1&';
  // const paramsStr2 = decodeURIComponent(paramStr);
  // const params = {};
  // // 将paramsStr 解析成对象
  // paramsStr2.split('&').forEach((item) => {
  //   const [key, value] = item.split('=');
  //   if (key) params[key] = value;
  // });
  let paramStr = '';
  for (const key in _params) {
    // let val=''
    paramStr += `${key}=${_params[key]}&`;
  }
  // 处理[ ]
  paramStr = paramStr.replace(/\[/g, '%5B').replace(/\]/g, '%5D');

  return fetch(`${domain}${URL}?${paramStr}`, {
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
