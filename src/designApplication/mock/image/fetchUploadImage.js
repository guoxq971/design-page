import { TOKEN } from '@/designApplication/mock/config';

/**
 * 上传设计图
 * @param {FormData} param 参数
 * @returns {Promise<import('@/design').UploadImageResponse>}
 * */
export async function fetchUploadImage(param) {
  const domain = 'http://gateway.testcustomwe.com';
  const URL = '/base-web/CMDesignImageAct/ajaxBatchUploadDesign.act';
  return fetch(`${domain}${URL}`, {
    headers: {
      pragma: 'no-cache',
      ssotoken: TOKEN,
    },
    body: param,
    method: 'POST',
  }).then((res) => res.text().then((e) => JSON.parse(e)));
}
