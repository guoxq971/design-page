import { parseCommonProd, parseProdItemDetail } from '@/designApplication/mock/prod/prodListByConmonDispose';
import { fetchProd3dConfigByCommon } from '@/designApplication/mock/prod/prod3dConfigByCommon';
import { config3dOfCommonMock } from '@/designApplication/mock/prod/config3dOfCommonMock';
import { Config3d } from '@/designApplication/interface/Config3d/config3dOfCommonResponse';
import { fetchProd3dConfigByRefineList } from '@/designApplication/mock/prod/prod3dConfigByRefileList';
import { config3dOfRefineListMock } from '@/designApplication/mock/prod/config3dOfRefineListMock';
import { Prod3dConfigByRefineListItem } from '@/designApplication/interface/Config3d/prod3dConfigByRefineList';
import { fetchRefineProdDetailByTemplateNoWithSize } from '@/designApplication/mock/prod/refineProdDetailByTemplateNoWithSize';
import { refineProdDetailByTemplateNoWithSizeMock } from '@/designApplication/mock/prod/refineProdDetailByTemplateNoWithSizeMock';
import { ProdItemDetail } from '@/designApplication/interface/commonProd';
import { fetchRefineProdConfig3dByTemplateNoWithSize } from '@/designApplication/mock/prod/refineProdConfig3dByTemplateNoWithSize';

/**
 * 获取通用产品列表
 * @param {Object|null} params
 * @returns {Promise<GetListByCommonProd>} 通用产品列表
 * */
export async function getCommonProdListApi(params = null) {
  const data = await parseCommonProd(params);

  return Promise.resolve(data);
}

/**
 * 根据模板号获取3d配置（通用模板）
 * @param {string} templateNo 模板号
 * @returns {Promise<Config3d>} 3d配置
 * */
export async function getProd3dConfigByCommonApi(templateNo) {
  const res = await fetchProd3dConfigByCommon(templateNo); //通过接口获取数据
  // const res = config3dOfCommonMock; //通过mock获取数据(写死的) templateNo=2424
  if (res.code !== 0) {
    return Promise.reject('请求3d配置-通用模板失败');
  }
  const result = new Config3d();
  Object.assign(result, res.data);

  // console.log('根据模板号获取3d配置', result);

  return Promise.resolve(result);
}

/**
 根据模板号获取3d配置（精细）
 @param {string} templateNo 模板号
 @returns {Promise<Prod3dConfigByRefineListItem[]>} 3d配置
 * */
export async function getProd3dConfigByRefineListApi(templateNo) {
  const res = await fetchProd3dConfigByRefineList(templateNo); //通过接口获取数据
  // const res = config3dOfRefineListMock; //通过mock获取数据(写死的) templateNo=2424
  if (res.code !== 0) {
    return Promise.reject('根据模板号获取3d配置（精细）失败');
  }

  const result = [];
  res.data.forEach((item) => {
    const item2 = new Prod3dConfigByRefineListItem();
    Object.assign(item2, item);
    result.push(item2);
  });

  // console.log('根据模板号获取3d配置（精细）', result);

  return Promise.resolve(result);
}

/**
 获取精细产品的详情数据-根据模板编号和尺码
 @param {string} templateNo 模板编号
 @param {string} size 尺码 (S,M,L,XL,XXL)
 @returns {Promise<ParseProdItem>} 产品详情数据
 * */
export async function getRefineProdDetailByTemplateNoWithSizeApi(templateNo, size) {
  const res = await fetchRefineProdDetailByTemplateNoWithSize(templateNo, size); //通过接口获取数据
  // const res = refineProdDetailByTemplateNoWithSizeMock; //通过mock获取数据(写死的) templateNo=2424, size=S

  // 接口数据
  const result = new ProdItemDetail();
  Object.assign(result, res);

  // 解析后
  const parseProdItem = parseProdItemDetail(result);

  // console.log('接口数据:', res);
  // console.log('接口数据2:', result);
  // console.log('解析后:', parseProdItem);

  return Promise.resolve(parseProdItem);
}

/**
 获取精细产品的3d配置数据-根据模板编号和尺码
 @param {string} templateNo 模板编号
 @param {string} size 尺码 (S,M,L,XL,XXL)
 @returns {Promise<Config3d>} 产品详情数据
 * */
export async function gerRefineProdConfig3dByTemplateNoWithSizeApi(templateNo, size) {
  const res = await fetchRefineProdConfig3dByTemplateNoWithSize(templateNo, size); //通过接口获取数据
  if (res.code !== 0) {
    return Promise.reject('请求3d配置-通用模板失败');
  }
  const result = new Config3d();
  Object.assign(result, res.data);

  // console.log('根据模板号获取3d配置', result);

  return Promise.resolve(result);
}
