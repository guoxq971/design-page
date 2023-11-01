import { fetchCollectImageListApi, setImageCollectApi } from '@/designApplication/apis/image';
import { fetchBackgroundCollectListApi } from '@/designApplication/apis/background';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import store from '@/store';

/**
 * 收藏|取消收藏 设计图
 * @param {import('@/design').ImageListItem} detail 设计图对象
 */
export async function collectImageFn(detail) {
  const param = { imgId: '', seqId: '', isBg: detail.isBg };

  // detail.quickimgid 有值就是从 收藏列表 进来的
  if (detail.quickimgid) {
    param.imgId = detail.seqId;
    param.seqId = detail.quickimgid;
  } else {
    param.imgId = detail.id;
  }

  let flag = true;
  const d = DesignerUtil.hasCollectImage(detail);
  if (d) {
    param.seqId = d.quickimgid;
    flag = false;

    await this.$confirm('确定取消收藏该设计图吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
  }

  // 取消|收藏 设计图
  await setImageCollectApi(param, flag);
  this.$message.success('操作成功');

  // 重新获取收藏列表
  if (detail.isBg) {
    const list = await fetchBackgroundCollectListApi();
    store.commit('designApplication/setCollectBgImageList', list);
  } else {
    const list = await fetchCollectImageListApi();
    store.commit('designApplication/setCollectImageList', list);
  }
}
