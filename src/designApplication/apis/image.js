import { fetchImageList } from '@/designApplication/mock/image/fetchImageList';
import { Message } from 'element-ui';
import { GetList, GetListByMyImage } from '@/designApplication/interface/getList';
import { GroupImageListParams, ImageListParams } from '@/designApplication/interface/image/imageListParams';
import { fetchAccountList } from '@/designApplication/mock/image/fetchAccountList';
import { fetchImageCategory } from '@/designApplication/mock/image/fetchImageCategory';
import { fetchImageCategoryByShare, fetchImageCategoryByShareOfTwo } from '@/designApplication/mock/image/fetchImageCategoryByShare';
import { fetchAdminImageList } from '@/designApplication/mock/image/fetchAdminImageList';
import { fetchAdminImageSelect } from '@/designApplication/mock/image/fetchAdminImageSelect';
import { fetchCollectImageList } from '@/designApplication/mock/image/fetchCollectImageList';
import { fetchGroupImageList } from '@/designApplication/mock/image/fetchGroupImageList';
import { fetchCollectImage } from '@/designApplication/mock/image/fetchCollectImage';
import { fetchDelCollectImage } from '@/designApplication/mock/image/fetchDelCollectImage';
import { fetchCollectImageBg } from '@/designApplication/mock/image/fetchCollectImageBg';
import { fetchUploadImage } from '@/designApplication/mock/image/fetchUploadImage';
import { fetchUploadImageCheck } from '@/designApplication/mock/image/fetchUploadImageCheck';
import { fetchSaveTextWord } from '@/designApplication/mock/image/fetchSaveTextWord';

/**
 * 获取设计图列表
 * @param {ImageListParams} params 参数
 * @returns {Promise<import('@/design').GetListImageAdmin>} 设计图列表
 * */
export async function getImageListApi(params) {
  const res = await fetchImageList(params);
  // const res = fetchImageListMock;
  if (res.retState !== '0') {
    Message.warning('获取设计图列表失败');
    return Promise.reject('获取设计图列表失败');
  }

  const result = new GetListByMyImage();
  result.list = res.designs;
  result.total = res.count;

  return Promise.resolve(result);
}

/**
 * 获取子账号列表
 * @returns {Promise<any[]>} 子账号列表
 * */
export async function getAccountListApi() {
  // const res=fetchAccountListMock;
  const res = await fetchAccountList();
  if (res.code !== 0) {
    Message.warning('获取子账号列表失败');
    return Promise.reject('获取子账号列表失败');
  }

  return Promise.resolve(res.data);
}

/**
 * 获取图片分类 - 所有图案
 * @returns {Promise<any[]>} 图片分类
 * */
export async function getImageCategoryApi() {
  // const res = fetchImageCategoryMock;
  const res = await fetchImageCategory();
  if (res.retState !== '0') {
    Message.warning('获取图片分类失败');
    return Promise.reject('获取图片分类失败');
  }

  return Promise.resolve(res.designCategories);
}

/**
 * 获取图片分类 - 共享图库 - 一级
 * @returns {Promise<any[]>} 图片分类
 * */
export async function getImageCategoryByShareApi() {
  // const res = FetchImageCategoryByShareMock;
  const res = await fetchImageCategoryByShare();
  if (res.retState !== '0') {
    Message.warning('获取图片分类 - 共享图库 - 一级 失败');
    return Promise.reject('获取图片分类 - 共享图库 - 一级 失败');
  }

  return Promise.resolve(res.data);
}

/**
 * 获取图片分类 - 共享图库 - 二级
 * @param {string} parentId 父级id
 * @returns {Promise<any[]>} 图片分类
 * */
export async function getImageCategoryByShareOfTwoApi(parentId) {
  // const res = FetchImageCategoryByShareOfTwoMock;
  const res = await fetchImageCategoryByShareOfTwo(parentId);
  if (res.retState !== '0') {
    Message.warning('获取图片分类 - 共享图库 - 二级 失败');
    return Promise.reject('获取图片分类 - 共享图库 - 二级 失败');
  }

  return Promise.resolve(res.CMDesignImageGxtypes);
}

/**
 *  获取管理员图库列表
 *  @param {Object} params 参数
 *  @returns {Promise<import('@/design').GetListImageAdmin>} 管理员图库列表
 * */
export async function fetchAdminImageListApi(params) {
  const res = await fetchAdminImageList(params);
  const msg = '获取管理员图库列表';
  if (res.code !== 0) {
    Message.warning(msg + ' 失败');
    return Promise.reject(msg + ' 失败');
  }

  const result = {
    total: res.data.total,
    list: res.data.records,
  };

  return Promise.resolve(result);
}

/**
 * 管理员图库 - 下拉列表
 * @param {Object} params 参数
 * @returns {Promise<any[]>} 下拉列表
 * */
export async function fetchAdminImageSelectApi(params) {
  const res = await fetchAdminImageSelect(params);
  const msg = '获取管理员图库下拉列表';
  if (res.code !== 0) {
    Message.warning(msg + ' 失败');
    return Promise.reject(msg + ' 失败');
  }

  return Promise.resolve(res.data);
}

/**
 * 获取列表 - 收藏图片
 * @returns {Promise<import('@/design').CollectImageListItem[]>} 列表
 * */
export async function fetchCollectImageListApi() {
  const res = await fetchCollectImageList();
  const msg = '获取收藏图片列表';
  if (res.retState !== '0') {
    Message.warning(msg + ' 失败');
    return Promise.reject(msg + ' 失败');
  }

  for (let item of res.list) {
    item.previewImg = item.designImg;
  }
  return Promise.resolve(res.list);
}

/**
 * 获取列表 - 小组图库
 * @param {GroupImageListParams} params 参数
 * @returns {Promise<any[]>} 列表
 * */
export async function fetchGroupImageListApi(params) {
  const res = await fetchGroupImageList(params);
  const msg = '获取小组图库列表';
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
 * 获取下拉列表 - 小组图库
 * @param {GroupImageListParams} params 参数
 * @returns {Promise<any[]>} 列表
 * */
export async function fetchGroupImageSelectApi(params = null) {
  const msg = '获取下拉列表 - 小组图库';

  const res = await fetchGroupImageList(params);
  if (res.retState !== '0') {
    Message.warning(msg + ' 失败');
    return Promise.reject(msg + ' 失败');
  }

  return Promise.resolve(res.designCategories);
}

/**
 * 设计图收藏
 * @param {{imgId:string,seqId:string,isBg:boolean}} param0 参数
 * @param {boolean} flag 是否收藏 true-收藏 false-取消收藏
 * @returns {Promise<void>}
 */
export async function setImageCollectApi({ imgId, seqId, isBg }, flag = true) {
  let res;
  if (flag) {
    if (isBg) {
      res = await fetchCollectImageBg(imgId);
    } else {
      res = await fetchCollectImage(imgId);
    }
  } else {
    res = await fetchDelCollectImage(seqId);
  }
  const msg = res.retMsg || '设计图收藏 失败';
  if (res.retState !== '0') {
    Message.warning(msg);
    return Promise.reject(msg);
  }

  return Promise.resolve(res);
}

/**
 * 上传设计图
 * @returns {Promise<import('@/design').UploadImageResponse>}
 */
export async function updateImageApi(param) {
  const res = await fetchUploadImage(param);
  const msg = res.retMsg || '上传设计图 失败';
  if (res.retState !== '0') {
    Message.warning(msg);
    return Promise.reject(msg);
  }

  return Promise.resolve(res);
}

/**
 * 上传设计图-确认
 * @param {import('@/design').UploadImageCheckParams} param 参数
 * @returns {Promise<import('@/design').UploadImageCheckItem>}
 */
export async function updateImageCheckApi(param) {
  const res = await fetchUploadImageCheck(param);
  const msg = res.code !== 0 ? '上传设计图-确认 失败' : res.msg;
  if (res.code !== 0) {
    Message.warning(msg);
    return Promise.reject(msg);
  }

  return Promise.resolve(res.data);
}

/**
 * 保存文字参数
 * @param {import('@/design').SaveTextParams} param 参数
 * @returns {Promise<void>}
 */
export async function saveTextWordApi(param) {
  const res = await fetchSaveTextWord(param);
  if (res.code !== 0) {
    Message.warning('保存文字参数失败');
    return Promise.reject('保存文字参数失败');
  }

  return Promise.resolve(res);
}
