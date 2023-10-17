import { fetchImageListMock } from '@/designApplication/mock/image/fetchImageListMock';
import { fetchImageList } from '@/designApplication/mock/image/fetchImageList';
import { Message } from 'element-ui';
import { GetList, GetListByMyImage } from '@/designApplication/interface/getList';
import { ImageListParams } from '@/designApplication/interface/image/imageListParams';
import { fetchAccountList } from '@/designApplication/mock/image/fetchAccountList';
import { fetchImageCategory } from '@/designApplication/mock/image/fetchImageCategory';
import { fetchImageCategoryMock } from '@/designApplication/mock/image/fetchImageCategoryMock';
import { fetchImageCategoryByShare, fetchImageCategoryByShareOfTwo } from '@/designApplication/mock/image/fetchImageCategoryByShare';
import { FetchImageCategoryByShareMock, FetchImageCategoryByShareOfTwoMock } from '@/designApplication/mock/image/fetchImageCategoryByShareMock';
import { fetchAdminImageList } from '@/designApplication/mock/image/fetchAdminImageList';
import { fetchAdminImageSelect } from '@/designApplication/mock/image/fetchAdminImageSelect';
import { fetchCollectImageList } from '@/designApplication/mock/image/fetchCollectImageList';

/**
 * 获取设计图列表
 * @param {ImageListParams} params 参数
 * @returns {Promise<GetListByMyImage>} 设计图列表
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
 *  @returns {Promise<any[]>} 管理员图库列表
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
 * @returns {Promise<any[]>} 列表
 * */
export async function fetchCollectImageListApi() {
  const res = await fetchCollectImageList();
  const msg = '获取收藏图片列表';
  if (res.retState !== '0') {
    Message.warning(msg + ' 失败');
    return Promise.reject(msg + ' 失败');
  }

  return Promise.resolve(res.list);
}
