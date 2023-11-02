import { fetchCollectImageListApi, setImageCollectApi } from '@/designApplication/apis/image';
import { fetchBackgroundCollectListApi } from '@/designApplication/apis/background';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import store from '@/store';
import { Message, MessageBox } from 'element-ui';

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

    await MessageBox.confirm('确定取消收藏该设计图吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
  }

  // 取消|收藏 设计图
  await setImageCollectApi(param, flag);
  Message.success('操作成功');

  // 重新获取收藏列表
  if (detail.isBg) {
    const list = await fetchBackgroundCollectListApi();
    store.commit('designApplication/setCollectBgImageList', list);
  } else {
    const list = await fetchCollectImageListApi();
    store.commit('designApplication/setCollectImageList', list);
  }
}

/**
 * 是否发生碰撞
 * @param {Konva.Image} rect
 * @param {Konva.Path} path
 * @returns {boolean} 是否发生碰撞 true-发生碰撞 false-未发生碰撞
 */
export function isCollide(rect, path) {
  // 获取矩形和 Path 的包围盒
  const rectBoundingBox = rect.getClientRect();
  const pathBoundingBox = path.getClientRect();

  // 矩形是否比 Path 大
  const isRectBig = rectBoundingBox.width > pathBoundingBox.width || rectBoundingBox.height > pathBoundingBox.height;

  // 矩形比 Path 小, 判断是否每个店都在 Path 内部
  if (!isRectBig) {
    // 获取矩形的4个角点坐标
    const rectTopLeft = { x: rectBoundingBox.x, y: rectBoundingBox.y };
    const rectTopRight = { x: rectBoundingBox.x + rectBoundingBox.width, y: rectBoundingBox.y };
    const rectBottomLeft = { x: rectBoundingBox.x, y: rectBoundingBox.y + rectBoundingBox.height };
    const rectBottomRight = { x: rectBoundingBox.x + rectBoundingBox.width, y: rectBoundingBox.y + rectBoundingBox.height };

    // 检查每个角点是否在 Path 内部
    const topLeftInside = path.intersects(rectTopLeft);
    const topRightInside = path.intersects(rectTopRight);
    const bottomLeftInside = path.intersects(rectBottomLeft);
    const bottomRightInside = path.intersects(rectBottomRight);
    if (topLeftInside && topRightInside && bottomLeftInside && bottomRightInside) {
      // 与车线完全没有碰撞
      // console.log('矩形的四个角点都在 Path 内部');
      return false;
    } else if (topLeftInside || topRightInside || bottomLeftInside || bottomRightInside) {
      // 有可能存在内部的车线与矩形的某个角点碰撞, 也有可能是矩形的某个角点在车线外部
      // console.log('矩形的四个角点中至少一个在 Path 内部');
      return true;
    } else {
      // console.log('矩形的四个角点都在 Path 外部');
      return true;
    }
  } else {
    // console.log('矩形比 Path 大');
    return true;
  }
}
