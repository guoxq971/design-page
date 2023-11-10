import { fetchProdListByCommon } from '@/designApplication/mock/prod/prodListByCommon2';
import { Message } from 'element-ui';
import { GetListByCommonProd } from '@/designApplication/interface/getList';
import { parseProdItemDetail } from '@/designApplication/mock/prod/prodListByConmonDispose';
import { fetchCollectSelectList } from '@/designApplication/mock/prod/fetchCollectSelectList';
import { fetchProdPrice } from '@/designApplication/mock/prod/fetchProdPrice';
import store from '@/store';
import { fetchCollectProd } from '@/designApplication/mock/prod/fetchCollectProd';
import { fetchDelCollectProd } from '@/designApplication/mock/prod/fetchDelCollectProd';
import { fetchSaveProd } from '@/designApplication/mock/prod/fetchSaveProd';
import { SubmitParamType } from '@/designApplication/interface_2/params';
import { fetchHistoryList } from '@/designApplication/mock/prod/fetchHistoryList';
import { fetchDelHistoryItem } from '@/designApplication/mock/prod/fetchDelHistoryItem';

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

/**
 * 获取产品价格
 * @param {string} templateNo
 * @returns {Promise<import('@/design').GetProdPriceApiType>}
 */
export async function getProdPriceApi(templateNo) {
  const result = {
    isSpecial: '',
    list: [],
  };
  try {
    store.commit('designApplication/setLoadingPrice', true);
    const res = await fetchProdPrice(templateNo);
    if (res.code !== 0) return Promise.reject('根据模板号获取价格列表 接口报错');
    console.error('根据模板号获取价格列表 接口返回数据为空');
    if (Object.keys(res.data).length === 0) return Promise.resolve(result);
    // console.log('根据模板号获取价格列表', res.data.data);
    result.isSpecial = res.data.templateType;
    result.list = res.data.resList.map((e) => {
      return {
        prop: e.templateProperty,
        list: e.priceList, //{price,num}
      };
    });
  } finally {
    store.commit('designApplication/setLoadingPrice', false);
  }
  return Promise.resolve(result);
}

/**
 * 产品收藏
 * @param {string} templateId
 */
export async function setCollectProdApi(templateId) {
  const res = await fetchCollectProd(templateId);
  if (res.code !== 0) {
    Message.warning('收藏产品失败');
    return Promise.reject('收藏产品失败');
  }

  return Promise.resolve(res);
}

/**
 * 产品取消收藏
 * @param {string} collectId
 */
export async function setDelCollectProdApi(collectId) {
  const res = await fetchDelCollectProd(collectId);
  if (res.code !== 0) {
    Message.warning('取消收藏产品失败');
    return Promise.reject('取消收藏产品失败');
  }

  return Promise.resolve(res);
}

/**
 * 保存产品
 * @param {SubmitParamType} param
 * @returns {Promise<import('@/design').SaveProdResponse>}
 */
export async function saveProdApi(param) {
  const res = await fetchSaveProd(param);
  if (!res.status) {
    Message.warning('保存产品失败');
    return Promise.reject({ msg: '保存产品失败' });
  }

  return res;
}

/**
 * 历史设计记录
 * @returns {Promise<import('@/design').HistoryItem[]>}
 */
export async function getHistoryListApi() {
  const res = await fetchHistoryList();
  if (res.retState !== '0') {
    Message.warning('历史设计记录');
    return Promise.reject({ msg: '历史设计记录' });
  }
  for (let item of res.products) {
    item.loading = false;
    item.visible = false;
  }
  return res.products;
}

/**
 * 删除历史记录
 * @param {string} seqIds historyItem.id
 * @returns {Promise<null>}
 */
export async function delHistoryApi(seqIds) {
  const res = await fetchDelHistoryItem(seqIds);
  if (res.code !== 0) {
    Message.warning('删除历史记录');
    return Promise.reject({ msg: '删除历史记录' });
  }

  return Promise.resolve(null);
}
