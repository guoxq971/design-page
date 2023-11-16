/**
 * @module store/collect
 * @property {import('@/design').CollectImageListItem[]} collectImageList 收藏的设计图列表
 * @property {import('@/design').CollectImageListItem[]} collectBgImageList 收藏的背景设计图列表
 * @property {boolean} visible_collect 收藏的设计图列表-弹窗开关
 */
export const collect_state = {
  visible_collect: false,
  collectProdList: [],
  // 收藏设计图
  collectImageList: [],
  // 收藏背景图
  collectBgImageList: [],
};

export const collect_mutations = {
  setVisibleCollect(state, visible) {
    state.visible_collect = visible;
  },
  setLoadingSave(state, loading) {
    state.loading_save = loading;
  },
  setCollectProdList(state, list) {
    state.collectProdList = list;
  },
  setCollectImageList(state, list) {
    state.collectImageList = list;
  },
  setCollectBgImageList(state, list) {
    for (let item of list) {
      item.id = item.seqId;
      item.previewImg = item.designImg;
    }
    state.collectBgImageList = list;
  },
};
export const collect_actions = {};
export const collect_getters = {};
