import { fetchProdListByCommon } from '@/designApplication/mock/prod/prodListByCommon2';
import { Message } from 'element-ui';
import { GetListByCommonProd } from '@/designApplication/interface/getList';
import { parseProdItemDetail } from '@/designApplication/mock/prod/prodListByConmonDispose';
import { fetchCollectSelectList } from '@/designApplication/mock/prod/fetchCollectSelectList';

/**
 * 获取产品列表 - FBA专用产品
 * @param {Object} params
 * @returns {Promise<GetListByCommonProd>} 通用产品的数据
 * */
export async function fetchProdListApi(params) {
  const res = await fetchProdListByCommon(params); //通过接口获取数据
  if (res.retState !== '0') {
    Message.warning('获取产品列表失败');
    return Promise.reject('获取产品列表失败');
  }

  const result = new GetListByCommonProd();

  // 有数据, 进行解析
  for (let row of res.productTypes) {
    result.list.push(parseProdItemDetail(row));
  }
  result.total = res.count;

  return Promise.resolve(result);
}

/**
 * 获取收藏产品的下拉列表
 * @returns {Promise<any>} 收藏产品的下拉列表
 * */
export async function fetchCollectSelectListApi() {
  // const res = fetchCollectSelectListMock;
  const res = await fetchCollectSelectList();
  if (res.retState !== '0') {
    Message.warning('收藏产品的下拉列表失败');
    return Promise.reject('收藏产品的下拉列表失败');
  }

  return Promise.resolve(res.options);
}
