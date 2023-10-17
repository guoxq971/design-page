import { fetchBackgroundImage } from '@/designApplication/mock/background/fetchBackgroundImage';
import { Message } from 'element-ui';
import { fetchBackgroundCollect } from '@/designApplication/mock/background/fetchBackgroundCollect';

/**
 * 获取列表 - 背景图
 * @param {object} params 参数
 * @returns {Promise<any>} 获取列表 - 背景图
 * */
export async function fetchBackgroundImageListApi(params) {
  const res = await fetchBackgroundImage(params);

  const msg = '获取列表 - 背景图';
  if (res.retState !== '0') {
    Message.warning(msg + ' 失败');
    return Promise.reject(msg + ' 失败');
  }

  const result = {
    total: res.count,
    list: res.designs,
  };

  return Promise.resolve(result);
}

/**
 * 获取列表 - 收藏背景
 * @returns {Promise<any[]>} 获取列表 - 背景图
 * */
export async function fetchBackgroundCollectListApi() {
  const res = await fetchBackgroundCollect();

  const msg = '获取列表 - 收藏背景';
  if (res.retState !== '0') {
    Message.warning(msg + ' 失败');
    return Promise.reject(msg + ' 失败');
  }

  return Promise.resolve(res.list);
}
